import Event from './event';

const bus = new Event();

bus.on('test', console.info)

bus.emit('test', 777)

bus.emit('test', 888)

bus.off('test', console.info)

bus.emit('test', 999)

bus.once('test once', console.log)

bus.emit('test once', 55555)

bus.emit('test once', 56666)
