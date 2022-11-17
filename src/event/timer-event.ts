const stringEventType = <T extends string>(arr: T[]) => arr

const types = stringEventType([
    'packetReceived',
    'timerConnected',
    'timerDisconnected',
    'started',
    'stopped',
    'reset',
    'ready',
    'unready',
    'starting',
    'leftHandDown',
    'leftHandUp',
    'rightHandDown',
    'rightHandUp',
])

export type TimerEvent = (typeof types)[number]

export const isEvent = (x: unknown): x is TimerEvent => typeof x === 'string' && types.includes(x as TimerEvent)
