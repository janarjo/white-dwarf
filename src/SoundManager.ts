export enum SoundCode {
    LASER = 'LASER',
    EXPLOSION = 'EXPLOSION',
    HIT = 'HIT',
    LAUNCH = 'LAUNCH',
    THRUST = 'THRUST',
}

export class SoundManager {
    private readonly sounds: Map<SoundCode, HTMLAudioElement>

    constructor() {
        this.sounds = new Map()
        this.sounds.set(SoundCode.LASER, this.load('sounds/laser.wav'))
        this.sounds.set(SoundCode.EXPLOSION, this.load('sounds/explosion.wav'))
        this.sounds.set(SoundCode.HIT, this.load('sounds/hit.wav'))
        this.sounds.set(SoundCode.LAUNCH, this.load('sounds/launch.wav'))
        this.sounds.set(SoundCode.THRUST, this.load('sounds/thrust.wav', 0.1))
    }

    play(code: SoundCode) {
        const audio = this.sounds.get(code)
        if (!audio) return

        audio.currentTime = 0
        audio.play()
    }

    private load(filePath: string, volume = 0.25) {
        const audio = new Audio()
        audio.src = filePath
        audio.volume = volume
        audio.load()
        return audio
    }
}
