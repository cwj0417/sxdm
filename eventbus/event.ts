type cbfn = (params: any) => any
class Event {
  events: Map<string, Set<cbfn>> = new Map()
  on (eventName: string, cb: cbfn) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).add(cb);
    } else {
      this.events.set(eventName, new Set([cb]));
    }
  }
  once (eventName: string, cb: cbfn) {
    const onceFn: cbfn = (param) => {
      this.off(eventName, onceFn);
      cb(param);
    }
    this.on(eventName, onceFn);
  }
  emit (eventName: string, params: any = undefined) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach(cb => cb(params));
    }
  }
  off (eventName: string, fn: cbfn) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).delete(fn);
    }
  }
}

export default Event;
