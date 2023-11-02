import { expect, describe, it } from 'vitest'
import Collection from './collection'

describe('Collection', () => {
    it('should constructor', () => {
        const collection = new Collection([1, 2, 3])
        expect(collection.toArray()).toEqual([1, 2, 3])
    })

    it('should constructor with Collection', () => {
        const collection = new Collection(new Collection([1, 2, 3]))
        expect(collection.toArray()).toEqual([1, 2, 3])
    })

    it('should constructor with invalid source', () => {
        expect(() => new Collection({} as any)).toThrow()
    })

    it('should add', () => {
        const collection = new Collection([1, 2, 3])
        collection.add(4)
        expect(collection.toArray()).toEqual([1, 2, 3, 4])
    })

    it('should filter', () => {
        const collection = new Collection([1, 2, 3])
        const filtered = collection.filter((item) => item > 2)
        expect(filtered.toArray()).toEqual([3])
    })

    it('should replace', () => {
        const collection = new Collection([1, 2, 3])
        collection.replace(4, 1)
        expect(collection.toArray()).toEqual([1, 4, 3])
    })

    it('should replace with invalid index', () => {
        const collection = new Collection([1, 2, 3])
        expect(() => collection.replace(4, 3)).toThrow()
    })

    it('should concat', () => {
        const collection = new Collection([1, 2, 3])
        const collection2 = new Collection([4, 5, 6])
        const concat = collection.concat(collection2)
        expect(concat.toArray()).toEqual([1, 2, 3, 4, 5, 6])
    })

    it('should concat without collection', () => {
        const collection = new Collection([1, 2, 3])
        const concat = collection.concat()
        expect(concat.toArray()).toEqual([1, 2, 3])
    })

    it('should toArray', () => {
        const collection = new Collection([1, 2, 3])
        expect(collection.toArray()).toEqual([1, 2, 3])
    })

    it('should chain', () => {
        const collection = new Collection([1, 2, 3])
        const filtered = collection
            .add(4) // [1, 2, 3, 4]
            .filter((item) => item > 2) // [3, 4]
            .replace(5, 1) // [3, 5]
            .concat(new Collection([6, 7])) // [3, 5, 6, 7]
        expect(filtered.toArray()).toEqual([3, 5, 6, 7])
    })

    it('should call lodash method', () => {
        const collection = new Collection([1, 2, 3])
        const result = collection.concat(new Collection([4, 5, 6])) // [1, 2, 3, 4, 5, 6]
        .add(7) // [1, 2, 3, 4, 5, 6, 7]
        .reverse() // [7, 6, 5, 4, 3, 2, 1]
        .add(0) // [7, 6, 5, 4, 3, 2, 1, 0]
        .add(-1) // [7, 6, 5, 4, 3, 2, 1, 0, -1]
        .filter(n => n % 2 != 0) // [7, 5, 3, 1, -1]
        .reverse() // [-1, 1, 3, 5, 7]
        .chunk(2) // [[-1, 1], [3, 5], [7]]
        .tail() // [[3, 5], [7]]
        .flattenDeep() // [3, 5, 7]
        expect(result.toArray()).toEqual(  [3, 5, 7])
    })

    it('should return number when lodash method return number', () => {
        const collection = new Collection([1, 2, 3])
        const result = collection.last()
        expect(result).toBe(3)
    })

    it('should return undefined when property does not exists', () => {
        const collection = new Collection([1, 2, 3])
        expect(collection.nothing).toBeUndefined()
    })

    it('should throw when calling an invalid method', () => {
        const collection = new Collection([1, 2, 3])
        expect(() => collection.invalidMethod()).toThrow()
    })
})