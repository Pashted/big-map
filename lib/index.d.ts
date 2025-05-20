export declare class BigMap<K, V = undefined> {
    private maps;
    constructor(arr: Array<[K, V]>);
    constructor(arr: K[]);
    constructor(arr: V[], key: string | number);
    get root(): Map<K, V>;
    get size(): number;
    get(key: K): V | undefined;
    set(key: K, value: V): this;
    delete(key: K): this;
    clear(): this;
    has(key: K): boolean;
    entries(): Array<[K, V]>;
    keys(): K[];
    values(): V[];
}
export default BigMap;
