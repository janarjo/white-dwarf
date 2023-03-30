export enum SoundCode {
    LASER,
}

export class SoundManager {
    private readonly sounds: Map<SoundCode, HTMLAudioElement>

    constructor() {
        this.sounds = new Map()
        this.sounds.set(SoundCode.LASER, new Audio('sounds/laser.wav'))
    }

    play(code: SoundCode) {
        const audio = this.sounds.get(code)
        if (audio) audio.play()
    }
}
