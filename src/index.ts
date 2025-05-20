const SOFT_LIMIT = Math.pow(2, 24) - 1; // ~16.7M

export class BigMap<K, V = undefined> {
    private maps: Array<Map<K, V>> = [];

    constructor(arr: Array<[K, V]>);
    constructor(arr: K[]);
    constructor(arr: V[], key: string | number);
    constructor(arr: any[], key?: string | number) {
        let tuples: Array<[K, V | undefined]>;

        if (key !== undefined) {
            // arr is Array of objects, take key and object
            tuples = (arr as V[]).map((obj) => [(obj as any)[key] as K, obj]);
        }
        else if (arr[0] instanceof Array) {
            // arr is Array of tuples [K, V]
            tuples = (arr as Array<[K, V]>).map(tuple => [tuple[0], tuple[1]]);
        }
        else {
            // arr - Array of primitives, take primitives as keys
            tuples = (arr as K[]).map(val => [val, undefined]);
        }

        tuples.reverse(); // iterate from the end to keep only last copies

        while (tuples.length) {
            const data = tuples
                .splice(0, SOFT_LIMIT)
                .reverse()
                .filter(([k]) => k !== undefined && !this.has(k as K)) as Array<[K, V]>;

            if (data.length) {
                this.maps.unshift(new Map<K, V>(data));
            }
        }
        if (!this.maps.length) {
            this.maps.push(new Map<K, V>());
        }
    }

    get root(): Map<K, V> {
        return this.maps[0];
    }

    get size(): number {
        return this.maps.reduce((sum, m) => sum + m.size, 0);
    }

    get(key: K): V | undefined {
        const map = this.maps.find(m => m.has(key));
        return map?.get(key);
    }

    set(key: K, value: V): this {
        if (this.root.size >= SOFT_LIMIT) {
            this.maps.unshift(new Map<K, V>());
            console.info(
                'BigMap extended to',
                this.maps.length, 'maps with total',
                this.size, 'elements',
            );
        }
        const map = this.maps.find(m => m.has(key)) || this.root;
        map.set(key, value);
        return this;
    }

    delete(key: K): this {
        const map = this.maps.find(m => m.has(key)) || this.root;
        map.delete(key);
        return this;
    }

    clear(): this {
        this.maps.forEach(m => m.clear());
        this.maps = [new Map<K, V>()];
        return this;
    }

    has(key: K): boolean {
        return this.maps.some(m => m.has(key));
    }

    entries(): Array<[K, V]> {
        return this.maps.flatMap(m => Array.from(m.entries()));
    }

    keys(): K[] {
        return this.maps.flatMap(m => Array.from(m.keys()));
    }

    values(): V[] {
        return this.maps.flatMap(m => Array.from(m.values()));
    }
}

export default BigMap;
