export declare class BigMap<K, V = undefined> {
    private maps;
    private readonly aggregate;
    static aggregate<K, V>(arr: V[], key: string | number): BigMap<K, V>;
    constructor(arr?: Array<[K, V]>, aggregate?: boolean);
    constructor(arr: K[], aggregate?: boolean);
    constructor(arr: V[], key: string | number, aggregate?: boolean);
    get root(): Map<K, V | V[]>;
    get size(): number;
    get(key: K): V | V[] | undefined;
    set(key: K, value: V): this;
    delete(key: K): this;
    clear(): this;
    has(key: K): boolean;
    entries(): Array<[K, V | V[]]>;
    keys(): K[];
    values(): Array<V | V[]>;
}
export default BigMap;
