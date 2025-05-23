type KeySelectorType = string | number | Array<string | number>;
export declare class BigMap<K, V = unknown, A extends boolean = false> {
    [Symbol.toStringTag]: string;
    private readonly _aggregate;
    private _maps;
    static groupBy<K, V extends Object>(key: KeySelectorType, arr: V[]): BigMap<K, V, false>;
    static aggregate<K, V extends Object>(key: KeySelectorType, arr: V[]): BigMap<K, V, true>;
    constructor(arr?: Array<[K, V]>);
    constructor(arr: K[]);
    constructor(arr: V[], key: KeySelectorType, aggregate?: boolean);
    private get _root();
    get size(): number;
    get(key: K): (A extends true ? V[] : V) | undefined;
    set(key: K, value: V): this;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): this;
    entries(): Array<[K, A extends true ? V[] : V]>;
    keys(): K[];
    values(): Array<A extends true ? V[] : V>;
    forEach(callback: (value: A extends true ? V[] : V, key: K, map: Map<K, A extends true ? V[] : V>) => void): void;
}
export default BigMap;
