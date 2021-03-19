import Yakusoku from './yakusoku';

const sucCb = console.log

const errCb = console.error

new Yakusoku((resolve, reject) => {
    resolve(5)
    reject(5)
})
    .then(sucCb, errCb)

new Yakusoku((resolve, reject) => {
    setTimeout(() => {
        resolve('500ms later resolve')
    }, 500);
})
    .then((p: string) => {
        return p + ' chaining';
    }, errCb)
    .then((p: string) => {
        return new Yakusoku((resolve) => {
            setTimeout(() => {
                resolve(p + ' 1500ms later resolve')
            }, 1500)
        })
    })
    .then(sucCb)

// case 已完成的promise

// case 未完成的promise

// case 传递已完成promise

// case 传递未完成的promise

// 疑问1: 函数不返回在ts里是void 在js里是undefined 答: 暂时断言
// 疑问2: promise内部回调需要array吗? 答: 同一个promise可以被then几次
