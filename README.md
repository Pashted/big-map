# BigMap

Works almost like regular `Map`, but without 16.7M size limitation.

Also allows non-standard behavior on initialization.

## Installation

```shell
npm install github:Pashted/big-map#master
```

## Examples

```typescript
let map = new BigMap([
    [ 1, 'a' ],
    [ 3, 'b' ],
    [ 5, 'c' ],
    [ 3, 'd' ],
    [ 3, 'e' ],
    [ 9, 'f' ],
]);
map.set(2, '10');
// Output of map.entries():
[
    [ 1, 'a' ],
    [ 3, 'e' ],
    [ 5, 'c' ],
    [ 9, 'f' ],
    [ 2, '10' ]
]
```

You can pass a simple array with primitives (result keys will be deduplicated).

```typescript
let map = new BigMap([ 1, 15, 2, 3, 4, 5, 4, 8, 3, 2, 'z', true ]);
map.delete(5);
// Output of map.entries():
[
    [ 1, undefined ],
    [ 15, undefined ],
    [ 2, undefined ],
    [ 3, undefined ],
    [ 4, undefined ],
    [ 8, undefined ],
    [ 'z', undefined ],
    [ true, undefined ]
]
```

Second argument tells the BigMap where to find keys for the new Map (works only with array of objects). Note that elements with `undefined` keys will eventually be omitted.
```typescript
let map = new BigMap<number, { a?: number, b?: string }>([
    { a: 3, b: '5' },
    { a: 2 },
    { a: 3 },
    { a: 4 },
    { a: 5 },
    { a: 15 },
    { b: '6' },
    { a: 3, b: '7' },
], 'a');
// Output of map.entries():
[
    [ 3, { a: 3, b: '7' } ],
    [ 2, { a: 2 } ],
    [ 4, { a: 4 } ],
    [ 5, { a: 5 } ],
    [ 15, { a: 15 } ]
]
```

Use `aggregate` option to collect values from the same key into an array.

```typescript
let map = BigMap.aggregate<number, { a?: number, b?: string }>([
    { a: 3, b: '5' },
    { a: 2 },
    { a: 3 },
    { a: 4 },
    { a: 5 },
    { a: 15 },
    { b: '6' },
    { a: 3, b: '7' },
], 'a');
// Output of map.entries():
[
    [ 3, [ { a: 3, b: '5' }, { a: 3 }, { a: 3, b: '7' } ] ],
    [ 2, [ { a: 2 } ] ],
    [ 4, [ { a: 4 } ] ],
    [ 5, [ { a: 5 } ] ],
    [ 15, [ { a: 15 } ] ]
]
```
