import { Packet } from './packet/packet'
import { SignalDecoder } from './signal-decoder'

export class AudioProcessor {
    private readonly callback: (packet: Packet) => void
    private stream?: MediaStream
    private context?: AudioContext
    private source?: MediaStreamAudioSourceNode
    private scriptNode?: ScriptProcessorNode

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
                this.scriptNode = this.context.createScriptProcessor(2048 * 4, 1, 1)
                const signalDecoder = new SignalDecoder(this.context.sampleRate, this.callback)
                this.scriptNode.onaudioprocess = (event: AudioProcessingEvent) => {
                    signalDecoder.decode(event.inputBuffer.getChannelData(0))
                }
                this.source.connect(this.scriptNode)
                this.scriptNode.connect(this.source.context.destination)
            }).catch((error: Error) => {
                console.error(error)
            })
        }
    }

    public stop() {
        if (this.context && this.source && this.scriptNode) {
            this.source.disconnect(this.scriptNode)
            this.scriptNode.disconnect(this.context.destination)
            this.scriptNode = undefined
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
