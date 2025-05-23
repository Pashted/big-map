"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigMap = void 0;
const SOFT_LIMIT = Math.pow(2, 24) - 1; // ~16.7M
class BigMap {
    static groupBy(key, arr) {
        return new BigMap(arr, key);
    }
    static aggregate(key, arr) {
        return new BigMap(arr, key, true);
    }
    constructor(arr = [], key, aggregate = false) {
        this[_a] = 'BigMap';
        this._maps = [];
        this._aggregate = aggregate;
        let tuples;
        if (typeof key === 'string' || typeof key === 'number') {
            // arr is Array of objects, take single key and object
            tuples = arr.map((obj) => [obj[key], obj]);
        }
        else if (key instanceof Array) {
            // arr is Array of objects, take combined key and object
            tuples = arr.map((obj) => [
                key.map(k => { var _b; return ((_b = obj[k]) !== null && _b !== void 0 ? _b : '') + ''; }).join('_'),
                obj,
            ]);
        }
        else if (arr[0] instanceof Array) {
            // arr is Array of tuples [K, V]
            tuples = arr.map(tuple => [tuple[0], tuple[1]]);
        }
        else {
            // arr is Array of primitives, take primitives as keys
            tuples = arr.map(val => [val, 1]);
        }
        if (!this._aggregate) {
            while (tuples.length) {
                const chunk = tuples
                    .splice(SOFT_LIMIT * -1) // iterate from the end to keep only last copies
                    .filter(([k]) => !this.has(k));
                if (chunk.length) {
                    this._maps.unshift(new Map(chunk));
                }
            }
            if (!this._maps.length) {
                this._maps = [new Map()];
            }
        }
        else {
            this._maps = [new Map()];
            while (tuples.length) {
                const chunk = tuples.splice(0, SOFT_LIMIT);
                // When aggregate = true, concatenate all values of the same key into one array
                for (const [k, v] of chunk) {
                    this.set(k, v);
                }
            }
        }
    }
    get _root() {
        return this._maps.at(-1);
    }
    get size() {
        return this._maps.reduce((sum, m) => sum + m.size, 0);
    }
    get(key) {
        const map = this._maps.find(m => m.has(key));
        if (!map)
            return undefined;
        return map.get(key);
    }
    set(key, value) {
        if (this._root.size >= SOFT_LIMIT) {
            this._maps.push(new Map());
            console.info('BigMap extended to', this._maps.length, 'maps with total', this.size, 'elements');
        }
        if (!this._aggregate) {
            const map = (this._maps.find(m => m.has(key)) || this._root);
            map.set(key, value);
        }
        else {
            const map = (this._maps.find(m => m.has(key)) || this._root);
            const existing = map.get(key);
            if (existing === undefined) {
                map.set(key, [value]);
            }
            else {
                existing.push(value);
            }
        }
        return this;
    }
    has(key) {
        return this._maps.some(m => m.has(key));
    }
    delete(key) {
        const map = this._maps.find(m => m.has(key)) || this._root;
        const exists = map.has(key);
        if (exists)
            map.delete(key);
        return exists;
    }
    clear() {
        this._maps.forEach(m => m.clear());
        this._maps = [new Map()];
        return this;
    }
    entries() {
        return this._maps.flatMap(m => Array.from(m.entries()));
    }
    keys() {
        return this._maps.flatMap(m => Array.from(m.keys()));
    }
    values() {
        return this._maps.flatMap(m => Array.from(m.values()));
    }
    forEach(callback) {
        for (const map of this._maps) {
            map.forEach(callback);
        }
    }
}
exports.BigMap = BigMap;
_a = Symbol.toStringTag;
exports.default = BigMap;
module.exports = BigMap;
