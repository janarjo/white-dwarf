interface Array<T> {
    flatMap<E>(callback: (t: T) => E[]): E[]
}

Object.defineProperty(Array.prototype, 'flatMap', {
    value(callback: Function) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (this as any[]).reduce((ys: any, x: any) => {
            return ys.concat(callback.call(this, x))
        }, [])
    },
    enumerable: false,
})
