"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigMap = void 0;
const SOFT_LIMIT = Math.pow(2, 24) - 1; // ~16.7M
class BigMap {
    constructor(arr, key) {
        this.maps = [];
        let tuples;
        if (key !== undefined) {
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
        tuples.reverse(); // iterate from the end to keep only last copies
        while (tuples.length) {
            const data = tuples
                .splice(0, SOFT_LIMIT)
                .reverse()
                .filter(([k]) => k !== undefined && !this.has(k));
            if (data.length) {
                this.maps.unshift(new Map(data));
            }
        }
        if (!this.maps.length) {
            this.maps.push(new Map());
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
            this.maps.unshift(new Map());
            console.info('BigMap extended to', this.maps.length, 'maps with total', this.size, 'elements');
        }
        const map = this.maps.find(m => m.has(key)) || this.root;
        map.set(key, value);
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
