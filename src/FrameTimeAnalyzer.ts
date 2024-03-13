export class FrameTimeAnalyzer {

    private updateInterval = 1000

    private lastUpdateFrameCount = 0
    private lastUpdate = performance.now()
    private realFps = 0
    
    private prevFrameTime = 0
    private frameTimes: number[] = []
    private maxFrameTimes = 100
    private averageFrameTime = 0

    public updateFrameRateInfo(newFrameTime: number): void {
        this.addFrameTime(newFrameTime - this.prevFrameTime)
        this.prevFrameTime = newFrameTime
        
        this.lastUpdateFrameCount++
        const now = performance.now()
        if (now - this.lastUpdate >= this.updateInterval) {
            this.realFps = this.lastUpdateFrameCount / ((now - this.lastUpdate) / this.updateInterval)
            this.averageFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
            this.lastUpdateFrameCount = 0
            this.lastUpdate = now
        }
    }

    public getDebugInfo(): FrameRateDebugInfo {
        return {
            fps: this.realFps,
            averageFrameTime: this.averageFrameTime
        }
    }

    private addFrameTime(frameTime: number): void {
        this.frameTimes.push(frameTime)
        if (this.frameTimes.length > this.maxFrameTimes) {
            this.frameTimes.shift()
        }
    }
}

export interface FrameRateDebugInfo {
    fps: number
    averageFrameTime: number
}
