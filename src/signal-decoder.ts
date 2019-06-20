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
        // Not using data.map() here because Float32Array.map always returns a Float32Array
        let bits: Bit[] = []
        for (const signal of data) {
            bits.push(signal <= 0 ? 1 : 0)
        }

        const startIndex = this.findBeginningOfSignal(bits)
        const runLengthEncoded: RunLength[] = runLengthEncode(bits.slice(startIndex))
        bits = this.getBitsFromRunLengthEncodedSignal(runLengthEncoded)
        const packet = getPacket(bits.slice(1))

        if (packet.isValid) {
            this.callback(packet)
        }
    }

    private findBeginningOfSignal(data: Bit[]): number | undefined {
        let oneCount = 0
        let waitingForZero = false

        for (let i = 0; i < data.length; i++) {
            if (data[i] === 1) {
                oneCount++

                if (oneCount > (9 * this.ticksPerBit)) {
                    // there's no byte in a package which contains 8 bits of 1
                    // that translates to 9 * ticksPerBit
                    waitingForZero = true
                }
            } else {
                oneCount = 0
                if (waitingForZero) {
                    return i
                }
            }
        }

        return undefined
    }

    private getBitsFromRunLengthEncodedSignal(array: RunLength[]): Bit[] {
        const x = array.map((e) => Array(Math.round(e.length / this.ticksPerBit)).fill(e.bit))
        return ([] as Bit[]).concat(...x)
    }
}

function runLengthEncode(data: Bit[]): RunLength[] {
    let lastBit = -1
    const result: RunLength[] = []

    for (const bit of data) {
        if (lastBit !== bit) {
            result.push({bit, length: 1})
            lastBit = bit
        } else {
            result[result.length - 1].length++
        }
    }

    return result
}

function getPacket(data: Bit[]): Packet {
    const tmp: number[] = []
    for (let i = 0; i <= 9; i++) {
        tmp.push(decodeBits(data, i * 10))
    }

    let packet: Packet = new PacketGen4(tmp)
    if (packet.isValid) {
        return packet
    } else {
        packet = new PacketGen3(tmp.slice(0, -1))
        return packet
    }
}

function decodeBits(data: Bit[], offset: number): number {
    let result = 0
    for (let i = 0; i < 8; i++) {
        // tslint:disable-next-line:no-bitwise
        result += data[offset + i] << i
    }
    return result
}
