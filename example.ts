import BigMap from './lib';
import util from 'node:util';

util.inspect.defaultOptions = {
    breakLength: 40,
};

/* Example 1 */
{
    let map = new BigMap<number, string>([
        [ 1, 'a' ],
        [ 3, 'b' ],
        [ 5, 'c' ],
        [ 3, 'd' ],
        [ 3, 'e' ],
        [ 9, 'f' ]
    ]);
    map.set(2, '10');
    log(1, map);
}

/* Example 2 */
{
    let map = new BigMap<number, undefined>([ 1, 15, 2, 3, 4, 5, 4, 8, 3, 2 ]);
    map.delete(5);
    log(2, map);
}

/* Example 3 */
{
    let map = new BigMap<number, { a?: number, b?: string }>([
        { a: 3, b: '5' },
        { a: 2 },
        { a: 15 },
        { b: '6' },
        { a: 3, b: '7' }
    ], 'a');
    map.get(2)!.b = '10';
    log(3, map);
}

function log(n: number, map: BigMap<any, any>) {
    console.log('\n', '- '.repeat(2) + 'MAP', n, '- '.repeat(15), '\n');
    console.log(`map.size =`, map.size);

    console.log(`map.entries() =`, map.entries());
}
