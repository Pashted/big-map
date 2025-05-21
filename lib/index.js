"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigMap = void 0;
const SOFT_LIMIT = Math.pow(2, 24) - 1; // ~16.7M
class BigMap {
    static aggregate(arr, key) {
        return new BigMap(arr, key, true);
    }
    constructor(arr = [], key, aggregate = false) {
        this.maps = [];
        this.aggregate = typeof key === 'boolean' ? key : aggregate;
        let tuples;
        if (typeof key === 'string' || typeof key === 'number') {
            // arr is Array of objects, take key and object
            tuples = arr.map((obj) => [obj[key], obj]);
        }
        else if (arr[0] instanceof Array) {
            // arr is Array of tuples [K, V]
            tuples = arr.map(tuple => [tuple[0], tuple[1]]);
        }
        else {
            // arr - Array of primitives, take primitives as keys
            tuples = arr.map(val => [val, undefined]);
        }
        tuples = tuples.filter(([k]) => k !== undefined);
        if (!this.aggregate) {
            while (tuples.length) {
                const chunk = tuples
                    .splice(SOFT_LIMIT * -1) // iterate from the end to keep only last copies
                    .filter(([k]) => !this.has(k));
                if (chunk.length) {
                    this.maps.unshift(new Map(chunk));
                }
            }
            if (!this.maps.length) {
                this.maps.push(new Map());
            }
        }
        else {
            this.maps.push(new Map());
            do {
                const chunk = tuples.splice(0, SOFT_LIMIT);
                // When aggregate = true, concatenate all values of the same key into one array
                for (const [k, v] of chunk) {
                    this.set(k, v);
                }
            } while (tuples.length);
        }
    }
    get root() {
        return this.maps[0];
    }
    get size() {
        return this.maps.reduce((sum, m) => sum + m.size, 0);
    }
    get(key) {
        const map = this.maps.find(m => m.has(key));
        return map === null || map === void 0 ? void 0 : map.get(key);
    }
    set(key, value) {
        if (this.root.size >= SOFT_LIMIT) {
            this.maps.unshift(this.aggregate ? new Map() : new Map());
            console.info('BigMap extended to', this.maps.length, 'maps with total', this.size, 'elements');
        }
        if (this.aggregate) {
            const map = (this.maps.find(m => m.has(key)) || this.root);
            const existing = map.get(key);
            if (existing === undefined) {
                map.set(key, [value]);
            }
            else {
                existing.push(value);
            }
        }
        else {
            const map = (this.maps.find(m => m.has(key)) || this.root);
            map.set(key, value);
        }
        return this;
    }
    delete(key) {
        const map = this.maps.find(m => m.has(key)) || this.root;
        map.delete(key);
        return this;
    }
    clear() {
        this.maps.forEach(m => m.clear());
        this.maps = [new Map()];
        return this;
    }
    has(key) {
        return this.maps.some(m => m.has(key));
    }
    entries() {
        return this.maps.flatMap(m => Array.from(m.entries()));
    }
    keys() {
        return this.maps.flatMap(m => Array.from(m.keys()));
    }
    values() {
        return this.maps.flatMap(m => Array.from(m.values()));
    }
}
exports.BigMap = BigMap;
exports.default = BigMap;
module.exports = BigMap;
