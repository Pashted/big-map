const SOFT_LIMIT = Math.pow(2, 24) - 1; // ~16.7M

type KeySelectorType = string | number | Array<string | number>;

export class BigMap<K, V = unknown, A extends boolean = false> {

    public [Symbol.toStringTag] = 'BigMap';
    private readonly _aggregate: A;
    private _maps: Array<Map<K, V | V[]>> = [];

    static groupBy<K, V extends Object>(key: KeySelectorType, arr: V[]) {
        return new BigMap<K, V>(arr, key);
    }

    static aggregate<K, V extends Object>(key: KeySelectorType, arr: V[]) {
        return new BigMap<K, V, true>(arr, key, true);
    }

    constructor(arr?: Array<[ K, V ]>); // common Map constructor
    constructor(arr: K[]); // Array of primitives
    constructor(arr: V[], key: KeySelectorType, aggregate?: boolean); // Array of objects
    constructor(arr: any[] = [], key?: KeySelectorType, aggregate: A = false as A) {
        this._aggregate = aggregate;

        let tuples: Array<[ K, V ]>;

        if (typeof key === 'string' || typeof key === 'number') {
            // arr is Array of objects, take single key and object
            tuples = (arr as V[]).map((obj: any) => [ obj[key] as K, obj as V ]);
        }
        else if (key instanceof Array) {
            // arr is Array of objects, take combined key and object
            tuples = (arr as V[]).map((obj) => [
                key.map(k => ((obj as any)[k] ?? '') + '').join('_') as K,
                obj,
            ]);
        }
        else if (arr[0] instanceof Array) {
            // arr is Array of tuples [K, V]
            tuples = (arr as Array<[ K, V ]>).map(tuple => [ tuple[0], tuple[1] ]);
        }
        else {
            // arr is Array of primitives, take primitives as keys
            tuples = (arr as K[]).map(val => [ val, 1 as V ]);
        }

        if (!this._aggregate) {
            while (tuples.length) {
                const chunk = tuples
                    .splice(SOFT_LIMIT * -1) // iterate from the end to keep only last copies
                    .filter(([ k ]) => !this.has(k as K)) as Array<[ K, V ]>;
                if (chunk.length) {
                    this._maps.unshift(new Map<K, V>(chunk));
                }
            }
            if (!this._maps.length) {
                this._maps = [ new Map<K, V>() ];
            }
        }
        else {
            this._maps = [ new Map<K, V[]>() ];

            while (tuples.length) {
                const chunk = tuples.splice(0, SOFT_LIMIT);
                // When aggregate = true, concatenate all values of the same key into one array
                for (const [ k, v ] of chunk) {
                    this.set(k, v as V);
                }
            }
        }
    }

    private get _root(): Map<K, V | V[]> {
        return this._maps.at(-1)!;
    }

    get size(): number {
        return this._maps.reduce((sum, m) => sum + m.size, 0);
    }

    get(key: K): (A extends true ? V[] : V) | undefined {
        const map = this._maps.find(m => m.has(key));
        if (!map)
            return undefined;
        return map.get(key) as any;
    }

    set(key: K, value: V): this {
        if (this._root.size >= SOFT_LIMIT) {
            this._maps.push(new Map<K, V | V[]>());
            console.info(
                'BigMap extended to',
                this._maps.length, 'maps with total',
                this.size, 'elements',
            );
        }

        if (!this._aggregate) {
            const map = (this._maps.find(m => m.has(key)) || this._root) as Map<K, V>;
            map.set(key, value);
        }
        else {
            const map = (this._maps.find(m => m.has(key)) || this._root) as Map<K, V[]>;
            const existing = map.get(key);

            if (existing === undefined) {
                map.set(key, [ value ]);
            }
            else {
                existing.push(value);
            }
        }
        return this;
    }

    has(key: K): boolean {
        return this._maps.some(m => m.has(key));
    }

    delete(key: K): boolean {
        const map = this._maps.find(m => m.has(key)) || this._root;
        const exists = map.has(key);
        if (exists)
            map.delete(key);
        return exists;
    }

    clear(): this {
        this._maps.forEach(m => m.clear());
        this._maps = [ new Map<K, V | V[]>() ];
        return this;
    }

    entries(): Array<[ K, A extends true ? V[] : V ]> {
        return this._maps.flatMap(m => Array.from(m.entries())) as any;
    }

    keys(): K[] {
        return this._maps.flatMap(m => Array.from(m.keys()));
    }

    values(): Array<A extends true ? V[] : V> {
        return this._maps.flatMap(m => Array.from(m.values())) as any;
    }

    public forEach(callback: (
        value: A extends true ? V[] : V,
        key: K,
        map: Map<K, A extends true ? V[] : V>,
    ) => void): void {
        for (const map of this._maps) {
            map.forEach(callback as any);
        }
    }
}

export default BigMap;
module.exports = BigMap;
