import { Packet } from './packet/packet'
import { SignalDecoder } from './signal-decoder'
import { stackmatWorkletProcessor } from './audio-worklet-processor'

export class AudioProcessor {
    private readonly callback: (packet: Packet) => void
    private stream?: MediaStream
    private context?: AudioContext
    private source?: MediaStreamAudioSourceNode
    private workletNode?: AudioWorkletNode

    constructor(callback: (packet: Packet) => void) {
        this.callback = callback
    }

    public start() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                },
            }).then((stream: MediaStream) => {
                this.stream = stream
                this.context = new AudioContext()
                this.source = this.context.createMediaStreamSource(this.stream)
                const signalDecoder = new SignalDecoder(this.context.sampleRate, this.callback)

                this.context.audioWorklet.addModule(stackmatWorkletProcessor).then(() => {
                    if (this.context && this.source) {
                        this.workletNode = new AudioWorkletNode(this.context, 'stackmat-processor', {numberOfInputs: 1, numberOfOutputs: 1})
                        this.workletNode.port.onmessage = (event: MessageEvent) => {
                            signalDecoder.decode(event.data)
                        }
                        this.source.connect(this.workletNode)
                        this.workletNode.connect(this.source.context.destination)
                    }
                })
            }).catch((error: Error) => {
                console.error(error)
            })
        }
    }

    public stop() {
        if (this.context && this.source && this.workletNode) {
            this.source.disconnect(this.workletNode)
            this.workletNode.disconnect(this.context.destination)
            this.workletNode = undefined
            this.source = undefined
            this.context.close().finally(() => {
                this.context = undefined
            })
        }

        if (this.stream) {
            this.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
            this.stream = undefined
        }
    }
}
