# json-key-map

A module for mapping between JSON keys and values

## Install

```
npm install json-key-map
```

## Usage

```js
const JsonKeyMap = require("json-key-map");
const map = new JsonKeyMap();
map.set({ foo: 1, bar: 2 }, "test-value");
map.get({ foo: 1, bar: 2 });
//=> 'test-value'
```

## API

### new JsonKeyMap([entries, [options]])

#### entries

Type: `JsonKeyMap` `Object`

Elements to populate the JsonKeyMap with. `Object` inputs must be in the same form as those created by the
[JsonKeyMap.prototype.toJSON\(\)](#jsonkeymapprototypetojson) method.

```js
const map1 = new JsonKeyMap();
const map2 = new JsonKeyMap(map1);
const map3 = new JsonKeyMap({ '{"foo":1,"bar":2}': "test-value" });
```

#### options

Type: `Object`

##### keyParser

Type: `Function`<br>
Default: `JSON.parse`

Parses strings into the keys they represent.

##### keyStringifier

Type: `Function`<br>
Default: `JSON.stringify`

Converts keys into strings.

```js
const stringify = require("json-stable-stringify");
const map = new JsonKeyMap(undefined, { keyStringifier: stringify });
```

### JsonKeyMap.prototype.clear()

Removes all key/value pairs from the `JsonKeyMap`.

### JsonKeyMap.prototype.delete(key)

Returns `true` if a element in the `JsonKeyMap` existed and has been removed, or `false` if the element does
not exist.

#### key

Type: `Array` `Object` `string` `number` `boolean` `null`

The key of the element to be deleted.

### JsonKeyMap.prototype.entries()

Returns a new `Iterator` object that contains an array of `[key, value]` for each element in the `JsonKeyMap`.

### JsonKeyMap.prototype.forEach(callbackFn)

Calls callbackFn once for each element present in the `JsonKeyMap`.

### JsonKeyMap.prototype.get(key)

Returns the value associated to the `key`, or `undefined` if there is none.

#### key

Type: `Array` `Object` `string` `number` `boolean` `null`

The `key` of the element to be returned.

### JsonKeyMap.prototype.has(key)

Returns a boolean asserting whether a value has been associated to the `key` in the `JsonKeyMap` or not.

#### key

Type: `Array` `Object` `string` `number` `boolean` `null`

The `key` of the element to be found.

### JsonKeyMap.prototype.keys()

Returns a new `Iterator` object that contains the keys for each element in the `JsonKeyMap`.

### JsonKeyMap.prototype.set(key, value)

Sets the value of the `key` in the `JsonKeyMap`. Returns the `JsonKeyMap`.

#### key

Type: `Array` `Object` `string` `number` `boolean` `null`

The `key` to set the value for.

#### value

Type: `any`

The value to store.

### JsonKeyMap.prototype.size

Type: `number`

The number of elements in the `JsonKeyMap`.

### JsonKeyMap.prototype.toJSON()

Returns an `Object` containing all elements in the `JsonKeyMap`.

```js
const map = new JsonKeyMap();
map.set({ foo: 1, bar: 2 }, "test-value");
const json = JSON.stringify(map);
console.log(JSON.parse(json));
//=>{ '{"foo":1,"bar":2}': "test-value" }
const map2 = new JsonKeyMap(JSON.parse(json));
```

### JsonKeyMap.prototype.values()

Returns a new `Iterator` object that contains the values for each element in the `JsonKeyMap`.

### JsonKeyMap.prototype\[@@iterator\]()

Returns a new `Iterator` object that contains an array of `[key, value]` for each element in the `JsonKeyMap`.

## Related

-   [composite-map](https://github.com/WesVanVugt/composite-map) - A module for mapping between multi-part keys and values.
-   [composite-object](https://github.com/WesVanVugt/composite-object) - A module for mapping between multi-part string keys and values.

## License

[MIT](https://github.com/WesVanVugt/json-key-map/blob/master/license)

## Sources

Some text from this readme was sourced from [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
