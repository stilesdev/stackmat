export enum PacketStatus {
    IDLE = 'I',
    STARTING = 'A',
    RUNNING = ' ',
    STOPPED = 'S',
    LEFT_HAND = 'L',
    RIGHT_HAND = 'R',
    BOTH_HANDS = 'C',
    INVALID = 'X',
}

export interface Packet {
    isValid: boolean
    status: PacketStatus
    timeInMilliseconds: number
    timeAsString: string
    isLeftHandDown: boolean
    isRightHandDown: boolean
    areBothHandsDown: boolean
}

export function isPacketStatusCharCode(charCode: number): boolean {
    return 'IA SLRC'.indexOf(String.fromCharCode(charCode)) !== -1
}

export function isNumberCharCode(charCode: number): boolean {
    return '0123456789'.indexOf(String.fromCharCode(charCode)) !== -1
}

export function isChecksumValid(checksum: number, digitCharCodes: number[]): boolean {
    return checksum === digitCharCodes.map((char) => Number(String.fromCharCode(char)))
        .reduce((previousValue, currentValue) => previousValue + currentValue) + 64
}

export abstract class PacketAbstract implements Packet {
    public readonly isValid: boolean
    public readonly status: PacketStatus
    public readonly timeInMilliseconds: number
    private readonly stringDigits: string[]

    protected constructor(isValid: boolean, status?: PacketStatus, stringDigits?: string[], timeInMilliseconds?: number) {
        this.isValid = isValid
        this.status = status || PacketStatus.INVALID
        this.stringDigits = stringDigits || []
        this.timeInMilliseconds = timeInMilliseconds || 0
    }

    get timeAsString(): string {
        return this.stringDigits.slice(0, 1)
            + ':' + this.stringDigits.slice(1, 3).join('')
            + '.' + this.stringDigits.slice(3).join('')
    }

    get isLeftHandDown(): boolean {
        return this.status === PacketStatus.LEFT_HAND || this.status === PacketStatus.BOTH_HANDS || this.status === PacketStatus.STARTING
    }

    get isRightHandDown(): boolean {
        return this.status === PacketStatus.RIGHT_HAND || this.status === PacketStatus.BOTH_HANDS || this.status === PacketStatus.STARTING
    }

    get areBothHandsDown(): boolean {
        return this.status === PacketStatus.BOTH_HANDS || this.status === PacketStatus.STARTING
    }
}
