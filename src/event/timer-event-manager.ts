import Timeout = NodeJS.Timeout
import { Packet, PacketStatus } from '../packet/packet'
import { isEvent, TimerEvent } from './timer-event'

export type TimerEventHandler = (lastPacket: Packet) => any

export class TimerEventManager {
    private lastPacket?: Packet
    private lastPacketRunning: boolean = false
    private lastPacketReset: boolean = false
    private handlers: Map<TimerEvent, TimerEventHandler[]> = new Map()

    private connectionTimer: Timeout
    private connected: boolean = false
    private lastPacketReceived: number = 0
    private connectionTimout: number = 1000

    constructor() {
        this.connectionTimer = setInterval(() => {
            if (this.connected && this.lastPacketReceived + this.connectionTimout < Date.now()) {
                this.connected = false
                this.fire('timerDisconnected')
            } else if (!this.connected && this.lastPacketReceived + this.connectionTimout > Date.now()) {
                this.connected = true
                this.fire('timerConnected')
            }
        }, 100, this)
    }

    public on(event: TimerEvent, callback: TimerEventHandler): void {
        if (isEvent(event)) {
            const handlers: TimerEventHandler[] = this.handlers.get(event) || []
            handlers.push(callback)
            this.handlers.set(event, handlers)
        }
    }

    public off(event?: TimerEvent): void {
        if (event && isEvent(event) && this.handlers.has(event)) {
            this.handlers.delete(event)
        } else if (!event) {
            this.handlers.clear()
        }
    }

    public receivePacket(packet: Packet): void {
        this.lastPacketReceived = Date.now()
        this.fire('packetReceived', packet)

        if (this.lastPacket) {
            if (this.lastPacket.isLeftHandDown && !packet.isLeftHandDown) {
                this.fire('leftHandUp', packet)
            } else if (!this.lastPacket.isLeftHandDown && packet.isLeftHandDown) {
                this.fire('leftHandDown', packet)
            }

            if (this.lastPacket.isRightHandDown && !packet.isRightHandDown) {
                this.fire('rightHandUp', packet)
            } else if (!this.lastPacket.isRightHandDown && packet.isRightHandDown) {
                this.fire('rightHandDown', packet)
            }

            if (!this.lastPacket.areBothHandsDown && packet.status === PacketStatus.BOTH_HANDS && this.lastPacket.timeInMilliseconds === 0) {
                this.fire('ready', packet)
            }

            if (this.lastPacket.status === PacketStatus.BOTH_HANDS && !packet.areBothHandsDown && packet.status !== PacketStatus.RUNNING && packet.timeInMilliseconds === 0) {
                this.fire('unready', packet)
            }

            if (this.lastPacket.status === PacketStatus.BOTH_HANDS && packet.status === PacketStatus.STARTING) {
                this.fire('starting', packet)
            }

            if (!this.lastPacketRunning && (packet.status === PacketStatus.RUNNING || (this.lastPacket.timeInMilliseconds === 0 && packet.timeInMilliseconds > 0))) {
                this.lastPacketRunning = true
                this.lastPacketReset = false
                this.fire('started', packet)
            }

            if (this.lastPacketRunning && (packet.status === PacketStatus.STOPPED || packet.status === PacketStatus.BOTH_HANDS || (this.lastPacket.timeInMilliseconds === packet.timeInMilliseconds && packet.timeInMilliseconds > 0))) {
                this.lastPacketRunning = false
                this.lastPacketReset = false
                this.fire('stopped', packet)
            }

            if (!this.lastPacketReset && packet.status === PacketStatus.IDLE) {
                this.lastPacketRunning = false
                this.lastPacketReset = true
                this.fire('reset', packet)
            }
        }

        this.lastPacket = packet
    }

    private fire(event: TimerEvent, packet?: Packet): void {
        for (const handler of this.handlers.get(event) || []) {
            handler(packet!) // TODO: rewrite to not require a packet for every call or create separate event listener type for dis/connect? just send lastPacket?
        }
    }
}
