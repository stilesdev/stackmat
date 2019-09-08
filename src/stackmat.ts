import { AudioProcessor } from './audio-processor'
import { isEvent, TimerEvent } from './event/timer-event'
import { TimerEventHandler, TimerEventManager } from './event/timer-event-manager'
import { Packet } from './packet/packet'

export default class Stackmat {
    private eventManager: TimerEventManager = new TimerEventManager()
    private audioProcessor?: AudioProcessor

    public on(event: TimerEvent, callback: TimerEventHandler): boolean {
        if (isEvent(event)) {
            this.eventManager.on(event, callback)
            return true
        } else {
            return false
        }
    }

    public off(event?: TimerEvent): boolean {
        if (event && !isEvent(event)) {
            return false
        } else {
            this.eventManager.off(event)
            return true
        }
    }

    public start(): void {
        if (this.audioProcessor) {
            this.stop()
        }

        this.audioProcessor = new AudioProcessor(((packet: Packet) => this.eventManager.receivePacket(packet)))
        this.audioProcessor.start() // TODO: handle errors that occur with browser audio API
    }

    public stop(): void {
        if (this.audioProcessor) {
            this.audioProcessor.stop()
            this.audioProcessor = undefined
        }
    }
}
