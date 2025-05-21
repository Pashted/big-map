import BigMap from './index.js';
import util from 'node:util';

util.inspect.defaultOptions = {
    breakLength: 40,
    depth: 3,
};

/* Example 1 */
{
    let map = new BigMap([
        [ 1, 'a' ],
        [ 3, 'b' ],
        [ 5, 'c' ],
        [ 3, 'd' ],
        [ 3, 'e' ],
        [ 9, 'f' ],
    ]);
    map.set(2, '10');
    log('EXAMPLE 1', map);
}

/* Example 2 */
{
    let map = new BigMap([ 1, 15, 2, 3, 4, 5, 4, 8, 3, 2, 'z', true ]);
    map.delete(5);
    log('EXAMPLE 2', map);
}

/* Example 3 */
{
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
    log('EXAMPLE 3', map);
}

/* Example 4 */
{
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
    log('EXAMPLE 4', map);
}

function log(title: string, map: BigMap<any, any>) {
    console.log('\n', '- '.repeat(2) + title, '- '.repeat(15));
    console.log(`map.size =>`, map.size);
    console.log(`map.entries() =>`, map.entries());
}
