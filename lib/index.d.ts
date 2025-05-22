type KeySelectorType = string | number | Array<string | number>;
export declare class BigMap<K, V = unknown> {
    [Symbol.toStringTag]: string;
    private _maps;
    private readonly _aggregate;
    static groupBy<K, V extends Object>(key: KeySelectorType, arr: V[]): BigMap<K, V>;
    static aggregate<K, V extends Object>(key: KeySelectorType, arr: V[]): BigMap<K, V>;
    constructor(arr?: Array<[K, V]>);
    constructor(arr: K[]);
    constructor(arr: V[], key: KeySelectorType, aggregate?: boolean);
    private get _root();
    get size(): number;
    get(key: K): V | V[] | undefined;
    set(key: K, value: V): this;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): this;
    entries(): Array<[K, V | V[]]>;
    keys(): K[];
    values(): Array<V | V[]>;
    forEach(callback: (value: V | V[], key: K, map: Map<K, V | V[]>) => void): void;
}
export default BigMap;
