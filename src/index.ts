const SOFT_LIMIT = Math.pow(2, 24) - 1; // ~16.7M

export class BigMap<K, V = undefined> {
    private maps: Array<Map<K, V | V[]>> = [];
    private readonly aggregate: boolean;

    static aggregate<K, V>(arr: V[], key: string | number) {
        return new BigMap<K, V>(arr, key, true);
    }

    constructor(arr?: Array<[ K, V ]>, aggregate?: boolean);
    constructor(arr: K[], aggregate?: boolean);
    constructor(arr: V[], key: string | number, aggregate?: boolean);
    constructor(arr: any[] = [], key?: string | number | boolean, aggregate: boolean = false) {
        this.aggregate = typeof key === 'boolean' ? key : aggregate;

        let tuples: Array<[ K, V | undefined ]>;

        if (typeof key === 'string' || typeof key === 'number') {
            // arr is Array of objects, take key and object
            tuples = (arr as V[]).map((obj) => [ (obj as any)[key] as K, obj ]);
        }
        else if (arr[0] instanceof Array) {
            // arr is Array of tuples [K, V]
            tuples = (arr as Array<[ K, V ]>).map(tuple => [ tuple[0], tuple[1] ]);
        }
        else {
            // arr - Array of primitives, take primitives as keys
            tuples = (arr as K[]).map(val => [ val, undefined ]);
        }

        tuples = tuples.filter(([ k ]) => k !== undefined);

        if (!this.aggregate) {
            while (tuples.length) {
                const chunk = tuples
                    .splice(SOFT_LIMIT * -1) // iterate from the end to keep only last copies
                    .filter(([ k ]) => !this.has(k as K)) as Array<[ K, V ]>;
                if (chunk.length) {
                    this.maps.unshift(new Map<K, V>(chunk));
                }
            }
            if (!this.maps.length) {
                this.maps.push(new Map<K, V>());
            }
        }
        else {
            this.maps.push(new Map<K, V[]>());

            do {
                const chunk = tuples.splice(0, SOFT_LIMIT);
                // When aggregate = true, concatenate all values of the same key into one array
                for (const [ k, v ] of chunk) {
                    this.set(k, v as V);
                }
            }
            while (tuples.length);
        }
    }

    get root(): Map<K, V | V[]> {
        return this.maps[0];
    }

    get size(): number {
        return this.maps.reduce((sum, m) => sum + m.size, 0);
    }

    get(key: K): V | V[] | undefined {
        const map = this.maps.find(m => m.has(key));
        return map?.get(key);
    }

    set(key: K, value: V): this {
        if (this.root.size >= SOFT_LIMIT) {
            this.maps.unshift(this.aggregate ? new Map<K, V[]>() : new Map<K, V>());
            console.info(
                'BigMap extended to',
                this.maps.length, 'maps with total',
                this.size, 'elements',
            );
        }

        if (this.aggregate) {
            const map = (this.maps.find(m => m.has(key)) || this.root) as Map<K, V[]>;
            const existing = map.get(key);

            if (existing === undefined) {
                map.set(key, [ value ] as V[]);
            }
            else {
                existing.push(value);
            }
        }
        else {
            const map = (this.maps.find(m => m.has(key)) || this.root) as Map<K, V>;
            map.set(key, value);
        }
        return this;
    }

    delete(key: K): this {
        const map = this.maps.find(m => m.has(key)) || this.root;
        map.delete(key);
        return this;
    }

    clear(): this {
        this.maps.forEach(m => m.clear());
        this.maps = [ new Map<K, V | V[]>() ];
        return this;
    }

    has(key: K): boolean {
        return this.maps.some(m => m.has(key));
    }

    entries(): Array<[ K, V | V[] ]> {
        return this.maps.flatMap(m => Array.from(m.entries()));
    }

    keys(): K[] {
        return this.maps.flatMap(m => Array.from(m.keys()));
    }

    values(): Array<V | V[]> {
        return this.maps.flatMap(m => Array.from(m.values()));
    }
}

export default BigMap;
module.exports = BigMap;
