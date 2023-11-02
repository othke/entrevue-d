import _ from "lodash";

const lodashHandler: ProxyHandler<ExtendableProxy> = {
    get(target: Collection, prop: string, receiver) {
        // Collection native methods
        if (typeof (target as any)[prop] === 'function') {
            return function (...args: any[]) {
                return Reflect.get(target, prop).bind(this)(...args);
            };
        }
        // Collection native properties 
        else if (typeof (target as any)[prop] !== 'undefined') {
            return Reflect.get(target, prop);
        }
        // lodash native methods
        else if (typeof (_ as any)[prop] === 'function') {
            return function (...args: any) {
                const result = Reflect.get(_, prop)(target.toArray(), ...args);
                if(Array.isArray(result)) {
                    return new Collection(result);
                }
                return result;
            };
        }
        return 
    }
}

class ExtendableProxy {
    constructor() {
        return new Proxy(this, lodashHandler);
    }
}

export default class Collection extends ExtendableProxy {
    private internal: any[]

    constructor(source: any[] | Collection) {
        super();
        if (Array.isArray(source)) {
            this.internal = Array.from(source)
        }
        else if (source instanceof Collection) {
            this.internal = source.toArray()
        }
        else {
            throw new Error("Invalid source")
        }
    }

    public concat(collection?: Collection): Collection {
        const toConcat = collection ? collection.toArray() : []
        return new Collection(this.internal.concat(toConcat))
    }

    public add(item: any): Collection {
        this.internal.push(item)
        return this
    }

    public filter(fn: (item: any) => boolean): Collection {
        return new Collection(this.internal.filter(fn))
    }

    public replace(item: any, index: number): Collection {
        if (index < 0 || index >= this.internal.length) {
            throw new Error("Index out of range")
        }
        this.internal[index] = item
        return this
    }

    public toArray(): any[] {
        return Array.from(this.internal)
    }
}
