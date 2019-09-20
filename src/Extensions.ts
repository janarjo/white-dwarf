interface Array<T> {
    flatMap<E>(callback: (t: T) => E[]): E[]
}

Object.defineProperty(Array.prototype, 'flatMap', {
    // tslint:disable-next-line:ban-types
    value(callback: Function) {
        return (this as any[]).reduce((ys: any, x: any) => {
            return ys.concat(callback.call(this, x))
        }, [])
    },
    enumerable: false,
})
