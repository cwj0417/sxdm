import { baseAdder, adder, inputToBin, add } from './add'

test('base adder', () => {
    expect(baseAdder(0, 0)).toEqual([0, 0])
    expect(baseAdder(0, 1)).toEqual([0, 1])
    expect(baseAdder(1, 0)).toEqual([0, 1])
    expect(baseAdder(1, 1)).toEqual([1, 0])
})

test('adder', () => {
    expect(adder(0, 0, 0)).toEqual([0, 0])
    expect(adder(0, 0, 1)).toEqual([0, 1])
    expect(adder(0, 1, 0)).toEqual([0, 1])
    expect(adder(0, 1, 1)).toEqual([1, 0])
    expect(adder(1, 0, 0)).toEqual([0, 1])
    expect(adder(1, 0, 1)).toEqual([1, 0])
    expect(adder(1, 1, 0)).toEqual([1, 0])
    expect(adder(1, 1, 1)).toEqual([1, 1])
})

test('process input', () => {
    expect(inputToBin(1, 1)).toEqual([[1], [1]])
    expect(inputToBin(4, 1)).toEqual([[0, 0, 1], [1, 0, 0]])
    expect(inputToBin(4, 1)).toEqual([[0, 0, 1], [1, 0, 0]])
    expect(inputToBin(0x31, 0b1101)).toEqual([[1, 0, 0, 0, 1, 1], [1, 0, 1, 1, 0, 0]])
})

test('add', () => {
    expect(add(1, 1)).toEqual(2)
    expect(add(2, 2)).toEqual(4)
    expect(add(5, 5)).toEqual(10)
    expect(add(0b111, 5)).toEqual(12)
})
