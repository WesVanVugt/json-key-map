declare namespace JsonKeyMap {
    interface JsonKeyMapOptions<K> {
        /**
         * Custom stringify function. By default uses JSON.stringify.
         */
        keyStringifier?: (key: K) => string;
        /**
         * Custom parse function. By default uses JSON.parse.
         */
        keyParser?: (key: string) => K;
    }
    interface JsonKeyObject<V> {
        [key: string]: V | undefined;
    }
}
declare class JsonKeyMap<K, V> {
    private readonly data;
    private readonly keyStringifier;
    private readonly keyParser;
    constructor(entries?: JsonKeyMap<K, V> | JsonKeyMap.JsonKeyObject<V>, options?: JsonKeyMap.JsonKeyMapOptions<K>);
    readonly size: number;
    set(key: K, value: V): this;
    clear(): void;
    delete(key: K): boolean;
    has(key: K): boolean;
    get(key: K): V | undefined;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    entries(): IterableIterator<[K, V]>;
    values(): IterableIterator<V>;
    keys(): IterableIterator<K>;
    forEach(callbackfn: (value: V, key: K) => void): void;
    toJSON(): JsonKeyMap.JsonKeyObject<V>;
}
export = JsonKeyMap;
