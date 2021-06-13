type binary = 0 | 1

const baseAdder = (a: binary, b: binary): [binary, binary] => ([(a & b) as binary, (a ^ b) as binary])

const adder = (a: binary, b: binary, c: binary): [binary, binary] => {
    const [next1, result1] = baseAdder(a, b)
    const [next2, result2] = baseAdder(result1, c)
    return [(next1 | next2) as binary, result2] // 这里 2个进位 只可能是 0/0 或者 0/1, 因为最大的就是 1 + 1 + 1.
}

const inputToBin = (a: number, b: number): [binary[], binary[]] => {
    const astring = a.toString(2)
    const bstring = b.toString(2)
    const length = Math.max(astring.length, bstring.length)
    return [
        (astring.split('').map(i => +i).reverse().concat(Array(length - astring.length).fill(0))) as binary[],
        (bstring.split('').map(i => +i).reverse().concat(Array(length - bstring.length).fill(0))) as binary[]
    ]
}

const add = (a: number, b: number): number => {
    const [aArray, bArray] = inputToBin(a, b)
    let result = []
    let curNext: binary = 0
    for (let index in aArray) {
        const [rn, rr] = adder(curNext, aArray[index], bArray[index])
        curNext = rn
        result.push(rr)
    }
    result.push(curNext)
    return parseInt(result.reverse().join(''), 2)
}

export {
    baseAdder,
    adder,
    inputToBin,
    add,
}
