# BigMap

Works almost like regular `Map`, but without 16.7M size limitation.

Also allows non-standard behavior on initialization.

## Installation

```shell
npm install github:Pashted/big-map#master
```

## Examples

```typescript
let date = new Date();
let map = new BigMap<any, string>([
    [ 1, 'a' ],
    [ 2, 'b' ],
    [ 3, 'c' ],
    [ 2, 'bb' ],
    [ 2, 'bbb' ],
    [ [ 'a', 'rr' ], 'arr-1' ],
    [ [ 'a', 'rr' ], 'arr-2' ],
    [ new Date(), 'new Date()-1' ],
    [ new Date(), 'new Date()-2' ],
    [ date, 'date-1' ],
    [ date, 'date-2' ],
    [ this, 'this' ],
    [ false, 'false' ],
    [ null, 'null' ],
    [ undefined, 'undefined' ],
    [ Infinity, 'Infinity' ],
    [ NaN, 'NaN' ],
    [ Object, 'Object' ],
]);
// Output of map.entries():
[
    [ 1, 'a' ],
    [ 2, 'bbb' ],
    [ 3, 'c' ],
    [ [ 'a', 'rr' ], 'arr-1' ],
    [ [ 'a', 'rr' ], 'arr-2' ],
    [ 2025-05-22T14:58:53.361Z, 'new Date()-1' ],
    [ 2025-05-22T14:58:53.361Z, 'new Date()-2' ],
    [ 2025-05-22T14:58:53.361Z, 'date-2' ],
    [ {}, 'this' ],
    [ false, 'false' ],
    [ null, 'null' ],
    [ undefined, 'undefined' ],
    [ Infinity, 'Infinity' ],
    [ NaN, 'NaN' ],
    [ [Function: Object], 'Object' ]
]
```

You can pass a simple array with primitives. Result keys will be deduplicated, values will be set to 1 by default.

```typescript
let map = new BigMap<any, number>([
    1, 15, 2, 3, 4, 5, 4, 5, 4, 5,
    'z', false, null, undefined,
]);
map.set(15, 100);
map.delete(5);
// Output of map.entries():
[
    [ 1, 1 ],
    [ 15, 100 ],
    [ 2, 1 ],
    [ 3, 1 ],
    [ 4, 1 ],
    [ 'z', 1 ],
    [ false, 1 ],
    [ null, 1 ],
    [ undefined, 1 ]
]
```

Use `groupBy` method to tell the BigMap where to find keys for the new Map (works only with array of objects).
Complex key supported.
```typescript
let map = BigMap.groupBy<number, { a?: number, b?: string }>('a', [
    { a: 2, b: '1' },
    { a: 2, b: '2' },
    { a: 3 },
    { a: 4 },
    { b: '3' },
    { b: '4' },
    { a: 2 },
]);
// Output of map.entries():
[
    [ 2, { a: 2 } ],
    [ 3, { a: 3 } ],
    [ 4, { a: 4 } ],
    [ undefined, { b: '4' } ]
]
```

Use `aggregate` to collect values from the same key into an array.
Complex key supported.

```typescript
let map = BigMap.aggregate<string, any>([ 'a', 'b' ], [
    { a: 0, b: '5' },
    { a: 0 },
    { a: 0, c: '5' },
    { a: 30.5, b: '5' },
    { a: 6, c: -1 },
    { b: '6' },
    { c: '6' },
    {
        get a() {
            return '6';
        },
    },
    { a: true, b: false },
    { a: null },
    { b: undefined },
]);
// Output of map.entries():
[
    [ '0_5', [ { a: 0, b: '5' } ] ],
    [ '0_', [
        { a: 0 },
        { a: 0, c: '5' },
    ] ],
    [ '30.5_5', [ { a: 30.5, b: '5' } ] ],
    [ '6_', [
        { a: 6, c: -1 },
        { a: [ Getter ] },
    ] ],
    [ '_6', [ { b: '6' } ] ],
    [ '_', [
        { c: '6' },
        { a: null },
        { b: undefined },
    ] ],
    [ 'true_false', [ { a: true, b: false } ] ],
];
```
