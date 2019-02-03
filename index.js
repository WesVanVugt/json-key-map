"use strict";
class JsonKeyMap {
    constructor(entries, options) {
        this.data = new Map();
        this.keyStringifier = (options && options.keyStringifier) || defaultStringifier;
        this.keyParser = (options && options.keyParser) || defaultParser;
        if (entries) {
            if (entries instanceof JsonKeyMap) {
                // Copy the values. This method was more performant than passing the map to the Map constructor.
                entries.data.forEach((v, k) => {
                    this.data.set(k, v);
                });
            }
            else {
                let key;
                for (key in entries) {
                    if (entries.hasOwnProperty(key)) {
                        this.data.set(key, entries[key]);
                    }
                }
            }
        }
    }
    get size() {
        return this.data.size;
    }
    set(key, value) {
        this.data.set(this.keyStringifier(key), value);
        return this;
    }
    clear() {
        this.data.clear();
    }
    delete(key) {
        return this.data.delete(this.keyStringifier(key));
    }
    has(key) {
        return this.data.has(this.keyStringifier(key));
    }
    get(key) {
        return this.data.get(this.keyStringifier(key));
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    entries() {
        const entries = this.data.entries();
        const iterator = {
            [Symbol.iterator]() {
                return iterator;
            },
            next: () => {
                const result = entries.next();
                if (result.value) {
                    result.value[0] = this.keyParser(result.value[0]);
                }
                return result;
            },
        };
        return iterator;
    }
    values() {
        return this.data.values();
    }
    keys() {
        const keys = this.data.keys();
        const iterator = {
            [Symbol.iterator]() {
                return iterator;
            },
            next: () => {
                const result = keys.next();
                if (result.value) {
                    result.value = this.keyParser(result.value);
                }
                return result;
            },
        };
        return iterator;
    }
    forEach(callbackfn) {
        if (callbackfn.length < 2) {
            // If the callback function does not accept the key argument, we can skip parsing it
            this.data.forEach((value) => {
                callbackfn(value);
            });
        }
        else {
            this.data.forEach((value, key) => {
                callbackfn(value, this.keyParser(key));
            });
        }
    }
    toJSON() {
        const obj = {};
        this.data.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
}
function defaultStringifier(key) {
    return JSON.stringify(key);
}
function defaultParser(key) {
    return JSON.parse(key);
}
module.exports = JsonKeyMap;
