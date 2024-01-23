# BigMap

Works almost like regular `Map`, but without 16.7M size limitation.

Also allows non-standard behavior on initialization.

### Installation

```shell
npm install github:Pashted/big-map#master
```

### Example

```javascript
let map = new BigMap([
    [1, 'a'],
    [3, 'b'],
    [5, 'c'],
    [2, 'd'],
    [3, 'e'],
    [9, 'f']
]);
// Output of map.entries():
// [
//     [ 1, 'a' ],
//     [ 3, 'e' ],
//     [ 5, 'c' ],
//     [ 9, 'f' ]
// ]
```

You can pass a simple array with primitives (result keys will be deduplicated).

```javascript
let map = new BigMap([1, 15, 2, 3, 4, 5, 4, 8, 3, 2, 'z', true]);
map.delete(5);
// Output of map.entries():
// [
//     [ 1, undefined ],
//     [ 15, undefined ],
//     [ 2, undefined ],
//     [ 3, undefined ],
//     [ 4, undefined ],
//     [ 8, undefined ],
//     [ 'z', undefined ],
//     [ true, undefined ]
// ]
```

Second argument tells the BigMap where to find keys for the new Map (works only with array of objects). Note that elements with `undefined` keys will eventually be omitted.
```javascript
let map = new BigMap([
    {a: 3, b: 5},
    {a: 2},
    {a: 15},
    {b: 6},
    {a: 3, b: 7}
], 'a');
map.get(2).c = 10;
// Output of map.entries():
// [
//     [ 3, { a: 3, b: 7 } ],
//     [ 2, { a: 2, c: 10 } ],
//     [ 15, { a: 15 } ]
// ]
```
