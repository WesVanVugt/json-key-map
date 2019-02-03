declare namespace JsonKeyMap {
    export interface JsonKeyMapOptions<K> {
        /**
         * Custom stringify function. By default uses JSON.stringify.
         */
        keyStringifier?: (key: K) => string;
        /**
         * Custom parse function. By default uses JSON.parse.
         */
        keyParser?: (key: string) => K;
    }

    export interface JsonKeyObject<V> {
        [key: string]: V | undefined;
    }
}

class JsonKeyMap<K, V> {
    private readonly data: Map<string, V>;
    private readonly keyStringifier: (key: K) => string;
    private readonly keyParser: (key: string) => K;

    constructor(entries?: JsonKeyMap<K, V> | JsonKeyMap.JsonKeyObject<V>, options?: JsonKeyMap.JsonKeyMapOptions<K>) {
        this.data = new Map();
        this.keyStringifier = (options && options.keyStringifier) || defaultStringifier;
        this.keyParser = (options && options.keyParser) || defaultParser;
        if (entries) {
            if (entries instanceof JsonKeyMap) {
                // Copy the values. This method was more performant than passing the map to the Map constructor.
                entries.data.forEach((v, k) => {
                    this.data.set(k, v);
                });
            } else {
                let key: keyof typeof entries;
                for (key in entries) {
                    if (entries.hasOwnProperty(key)) {
                        this.data.set(key, entries[key] as V);
                    }
                }
            }
        }
    }

    public get size(): number {
        return this.data.size;
    }

    public set(key: K, value: V): this {
        this.data.set(this.keyStringifier(key), value);
        return this;
    }

    public clear(): void {
        this.data.clear();
    }

    public delete(key: K): boolean {
        return this.data.delete(this.keyStringifier(key));
    }

    public has(key: K): boolean {
        return this.data.has(this.keyStringifier(key));
    }

    public get(key: K): V | undefined {
        return this.data.get(this.keyStringifier(key));
    }

    public [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }

    public entries(): IterableIterator<[K, V]> {
        const entries = this.data.entries();

        const iterator: IterableIterator<[K, V]> = {
            [Symbol.iterator]() {
                return iterator;
            },
            next: () => {
                const result = entries.next();
                if (result.value) {
                    result.value[0] = this.keyParser(result.value[0]) as any;
                }
                return result as IteratorResult<[any, V]>;
            },
        };
        return iterator;
    }

    public values(): IterableIterator<V> {
        return this.data.values();
    }

    public keys(): IterableIterator<K> {
        const keys = this.data.keys();

        const iterator: IterableIterator<K> = {
            [Symbol.iterator]() {
                return iterator;
            },
            next: () => {
                const result = keys.next();
                if (result.value) {
                    result.value = this.keyParser(result.value) as any;
                }
                return result as IteratorResult<any>;
            },
        };
        return iterator;
    }

    public forEach(callbackfn: (value: V, key: K) => void): void {
        if (callbackfn.length < 2) {
            // If the callback function does not accept the key argument, we can skip parsing it
            this.data.forEach((value) => {
                (callbackfn as (value: V) => void)(value);
            });
        } else {
            this.data.forEach((value, key) => {
                callbackfn(value, this.keyParser(key));
            });
        }
    }

    public toJSON(): JsonKeyMap.JsonKeyObject<V> {
        const obj: JsonKeyMap.JsonKeyObject<V> = {};
        this.data.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
}

export = JsonKeyMap;

function defaultStringifier(key: any): string {
    return JSON.stringify(key);
}
function defaultParser(key: string): any {
    return JSON.parse(key);
}
