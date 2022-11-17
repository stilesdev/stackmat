interface AudioWorkletProcessor {
    readonly port: MessagePort
    process(
        inputs: Float32Array[][],
        outputs: Float32Array[][],
        parameters: Record<string, Float32Array>
    ): boolean
}

declare let AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor
    new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor
}

declare function registerProcessor(
    name: string,
    processorCtor: (new (options?: AudioWorkletNodeOptions) => AudioWorkletProcessor)
): undefined

declare let currentFrame: number
declare let currentTime: number
declare let sampleRate: number
