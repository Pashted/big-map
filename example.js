const BigMap = require('./index.js');
const util = require('util');
util.inspect.defaultOptions = {
    breakLength: 40,
};

function log(n, map) {
    console.log(`map${n}.size:`, map.size);

    console.log(`map${n}.entries():`);
    console.log(map.entries());

    console.log('\n');
}

/* Example 1 */
let map1 = new BigMap([
    [1, 'a'],
    [3, 'b'],
    [5, 'c'],
    [3, 'd'],
    [3, 'e'],
    [9, 'f']
]);
log(1, map1);

/* Example 2 */
let map2 = new BigMap([1, 15, 2, 3, 4, 5, 4, 8, 3, 2, 'z', true]);
map2.delete(5);
log(2, map2);

/* Example 3 */
let map3 = new BigMap([
    {a: 3, b: 5},
    {a: 2},
    {a: 15},
    {b: 6},
    {a: 3, b: 7}
], 'a');
map3.get(2).c = 10;
log(3, map3);
