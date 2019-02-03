import { expect } from "chai";
import stringify from "json-stable-stringify";
import JsonKeyMap, { JsonKeyMapOptions, JsonKeyObject } from "./imports";

function jsonClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

describe("json-key-map", () => {
    before(() => {
        // Don't try this at home
        (Object.prototype as any).__bad = true;
    });

    it(".prototype.size", () => {
        const map = new JsonKeyMap<string[], string>();
        expect(map.size).to.equal(0);
        map.set(["a", "b"], "test");
        expect(map.size).to.equal(1);
        map.delete(["a", "b"]);
        expect(map.size).to.equal(0);
    });

    it(".prototype.get(key)", () => {
        const map = new JsonKeyMap<string[], string>();
        map.set(["a", "b"], "test").set(["b", "a"], "test2");
        expect(map.get(["a", "b"])).to.equal("test");
        expect(map.get(["b", "a"])).to.equal("test2");
        expect(map.get(["a", "c"])).to.equal(undefined);
    });

    it(".prototype.has(key)", () => {
        const map = new JsonKeyMap<string[], boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a", "b"])).to.equal(true);
        expect(map.has(["a", "c"])).to.equal(false);
    });

    it(".prototype.delete(key)", () => {
        const map = new JsonKeyMap<string[], boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a", "b"])).to.equal(true);
        expect(map.delete(["a", "c"])).to.equal(false);
        expect(map.delete(["a", "b"])).to.equal(true);
        expect(map.has(["a", "b"])).to.equal(false);
        expect(map.delete(["a", "b"])).to.equal(false);
    });

    it(".prototype.clear()", () => {
        const map = new JsonKeyMap<string[], boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a", "b"])).to.equal(true);
        map.clear();
        expect(map.has(["a", "b"])).to.equal(false);
    });

    it(".prototype.forEach((value, key) => {})", () => {
        const map = new JsonKeyMap<string[], string>();
        map.set(["b", "a"], "test").set(["a", "b"], "test2");
        const output: Array<[string[], string]> = [];

        map.forEach((value, key) => {
            output.push([key, value]);
        });
        expect(output).to.deep.equal([[["b", "a"], "test"], [["a", "b"], "test2"]]);
    });

    // To improve performance, if the key parameter is not accepted, separate code is run to avoid calculating the key
    it(".prototype.forEach((value) => {})", () => {
        const map = new JsonKeyMap<string[], string>();
        map.set(["b", "a"], "test").set(["a", "b"], "test2");
        const output: string[] = [];

        map.forEach((value) => {
            output.push(value);
        });
        expect(output).to.deep.equal(["test", "test2"]);
    });

    it(".prototype.entries() / .prototype[@@iterator]()", () => {
        const map = new JsonKeyMap<string[], string>();
        map.set(["a", "a", "a"], "test").set(["b", "a", "a"], "test2");
        expect(Array.from(map)).to.deep.equal([[["a", "a", "a"], "test"], [["b", "a", "a"], "test2"]]);
        expect(Array.from(map.entries())).to.deep.equal([[["a", "a", "a"], "test"], [["b", "a", "a"], "test2"]]);
    });

    it(".prototype.keys()", () => {
        const map = new JsonKeyMap<string[], string>();
        map.set(["a", "a", "a"], "test").set(["b", "a", "a"], "test2");
        expect(Array.from(map.keys())).to.deep.equal([["a", "a", "a"], ["b", "a", "a"]]);
        map.clear();
        map.set(["a"], "test").set(["b"], "test2");
        expect(Array.from(map.keys())).to.deep.equal([["a"], ["b"]]);
    });

    it(".prototype.values()", () => {
        const map = new JsonKeyMap<string[], string>();
        map.set(["a", "a", "a"], "test").set(["b", "a", "a"], "test2");
        expect(Array.from(map.values())).to.deep.equal(["test", "test2"]);
    });

    it("constructor(map)", () => {
        const map = new JsonKeyMap<string[], string>();
        map.set(["a", "b"], "test");
        const mapCopy = new JsonKeyMap(map);
        expect(mapCopy.get(["a", "b"])).to.equal("test");
    });

    it("constructor(object)", () => {
        const obj: JsonKeyObject<string> = { '["a","b"]': "test" };
        const map = new JsonKeyMap<string[], string>(obj);
        expect(map.get(["a", "b"])).to.equal("test");
    });

    it(".prototype.toJSON()", () => {
        const map = new JsonKeyMap<string[], string>();
        map.set(["a", "b"], "test").set(["b", "a"], "test2");
        const json = jsonClone(map);
        expect(json).to.deep.equal({
            '["a","b"]': "test",
            '["b","a"]': "test2",
        });
    });

    it("constructor(undefined, { keyStringifier: Function })", () => {
        interface KeyType {
            a: number;
            b: number;
            c: number;
        }
        // Test importing this type
        const options: JsonKeyMapOptions<KeyType> = {
            keyStringifier: (key) => stringify(key),
        };
        let map = new JsonKeyMap<KeyType, string>(undefined, options);
        map.set({ b: 1, a: 1, c: 1 }, "test");
        expect(map.has({ c: 1, a: 1, b: 1 })).to.equal(true);
        expect(map.get({ c: 1, a: 1, b: 1 })).to.equal("test");
        expect(map.delete({ c: 1, a: 1, b: 1 })).to.equal(true);

        // Verify that without sorting, it fails
        map = new JsonKeyMap();
        map.set({ b: 1, a: 1, c: 1 }, "test");
        expect(map.has({ c: 1, a: 1, b: 1 })).to.equal(false);
        expect(map.get({ c: 1, a: 1, b: 1 })).to.equal(undefined);
        expect(map.delete({ c: 1, a: 1, b: 1 })).to.equal(false);
    });

    it("constructor(undefined, { keyParser: Function })", () => {
        const map = new JsonKeyMap<string[], string>(undefined, {
            keyParser: (key) => key.split(","),
            keyStringifier: (key) => key.join(","),
        });
        map.set(["a", "b", "c"], "test");
        // Verify the internal representation of the data
        expect(map.toJSON()).to.deep.equal({ "a,b,c": "test" });
        expect([...map.keys()]).to.deep.equal([["a", "b", "c"]]);
        expect([...map.entries()]).to.deep.equal([[["a", "b", "c"], "test"]]);
        const entries: Array<[string[], string]> = [];
        map.forEach((value, key) => {
            entries.push([key, value]);
        });
        expect(entries).to.deep.equal([[["a", "b", "c"], "test"]]);
    });
});
