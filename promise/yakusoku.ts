type Yakusokuhandler = (result: Object) => Yakusoku | Object | void;
export default class Yakusoku {
    status: 'pending' | 'fulfilled' | 'rejected' = 'pending';
    value: Object;
    reason: Object;
    fulfilledCallbacks: Function[] = [];
    rejectedCallbacks: Function[] = [];

    constructor(excutor: (resolve: Yakusokuhandler, reject: Yakusokuhandler) => void) {
        const resolve: (value: Object) => void = value => {
            if (this.status !== 'pending') return
            this.status = 'fulfilled';
            this.value = value;
            this.fulfilledCallbacks.forEach(f => f(value));
        }
        const reject: (reason: Object) => void = reason => {
            if (this.status !== 'pending') return
            this.status = 'rejected';
            this.reason = reason;
            this.rejectedCallbacks.forEach(f => f(reason));
        }
        try {
            excutor(resolve, reject);
        } catch (e) {

        }
    }

    then = (onFulfilled?: Yakusokuhandler, onRejected?: Yakusokuhandler) => {
        return new Yakusoku((resolve, reject) => {
            try {
                if (this.status === 'pending') {
                    this.fulfilledCallbacks.push((value: Object) => {
                        const result = onFulfilled(value) as Object | undefined;
                        if (result instanceof Yakusoku) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    });
                    this.rejectedCallbacks.push((rejectReason: Object) => {
                        const reason = onRejected(rejectReason) as Object | undefined;
                        if (reason instanceof Yakusoku) {
                            reason.then(resolve, reject);
                        } else {
                            reject(reason);
                        }
                    });
                }
                if (this.status === 'fulfilled') {
                    const result = onFulfilled(this.value) as Object | undefined;
                    if (result instanceof Yakusoku) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                }
                if (this.status === 'rejected') {
                    const reason = onRejected(this.reason)  as Object | undefined;
                    if (reason instanceof Yakusoku) {
                        reason.then(resolve, reject);
                    } else {
                        reject(reason);
                    }
                }
            } catch (e) {
                reject(e);
            }
        })
    }
}
