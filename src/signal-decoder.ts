/**
 * A majority of the code in this file is based on the RS232Decoder class in stackmat.js, by Tim Habermaas.
 *
 * The original source was written in CoffeeScript and published to GitHub under the MIT License.
 *
 * https://github.com/timhabermaas/stackmat.js
 *
 * Converted to TypeScript and modified for use in this project.
 */
import { Packet } from './packet/packet'
import { PacketGen3 } from './packet/packet-gen3'
import { PacketGen4 } from './packet/packet-gen4'

type Bit = 0 | 1

interface RunLength {
    bit: Bit
    length: number
}

export class SignalDecoder {
    private readonly ticksPerBit: number
    private readonly callback: (packet: Packet) => void

    constructor(sampleRate: number, callback: (packet: Packet) => void) {
        this.ticksPerBit = sampleRate / 1200
        this.callback = callback
    }

    public decode(data: Float32Array) {
        let bits: Bit[] = []
        data.forEach((value) => {
            const bit = floatSignalToBinary(value)
            if (bit !== undefined) {
                bits.push(bit)
            }
        })

        const startIndex = this.findBeginningOfSignal(bits)

        const runLengthEncoded: RunLength[] = runLengthEncode(bits.slice(startIndex))
        bits = getBitsFromRunLengthEncodedSignal(runLengthEncoded, this.ticksPerBit)
        const packet = getPacket(bits.slice(1))
        if (packet) {
            this.callback(packet)
        }
    }

    private findBeginningOfSignal(data: Bit[]): number | undefined {
        let oneCount = 0
        let waitingForZero = false

        let i = 0
        while (i < data.length) {
            const bit = data[i]
            if (bit === 1) {
                oneCount += 1
            }
            if (oneCount > (9 * this.ticksPerBit)) {  // there's no byte in a package which contains 8 bits of 1
                // that translates to 9 * ticksPerBit
                waitingForZero = true
            }
            if (bit === 0) {
                oneCount = 0
                if (waitingForZero) {
                    return i
                }
            }
            i += 1
        }

        return undefined
    }
}

function floatSignalToBinary(signal: number): Bit | undefined {
    if (signal < 0) {
        return 1
    }
    if (signal > 0) {
        return 0
    }
    return undefined
}

function runLengthEncode(data: Bit[]): RunLength[] {
    let lastBit = -1
    const result: RunLength[] = []

    let i = 0
    while (i < data.length) {
        if (lastBit !== data[i]) {
            result.push({bit: data[i], length: 1})
            lastBit = data[i]
        } else {
            result[result.length - 1].length += 1
        }
        i += 1
    }

    return result
}

function getBitsFromRunLengthEncodedSignal(array: RunLength[], period: number): Bit[] {
    let bitsCount: number
    const x = (Array.from(array).map((e) => (
        (bitsCount = Math.round(e.length / period)),
            (getRange(1, bitsCount).map(() => e.bit))
    )))
    return ([] as Bit[]).concat(...(x || []))
}

function getPacket(data: Bit[]) {
    const tmp = getRange(0, 9).map((i) => decodeBits(data, i * 10))
    let packet: Packet

    packet = new PacketGen4(tmp)
    if (packet.isValid) {
        return packet
    } else {
        packet = new PacketGen3(tmp.slice(0, -1))
        return packet.isValid ? packet : undefined
    }
}

function decodeBits(data: Bit[], offset: number) {
    let result = 0
    let i = 0
    while (i < 8) {
        // tslint:disable-next-line:no-bitwise
        result += data[offset + i] << i
        i += 1
    }
    return result
}

function getRange(start: number, end: number) {
    const range = []
    const ascending = start < end
    for (let i = start; ascending ? i <= end : i >= end; ascending ? i++ : i--) {
        range.push(i)
    }
    return range
}
