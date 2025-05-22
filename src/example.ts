import BigMap from './index.js';
import util from 'node:util';

util.inspect.defaultOptions = {
    breakLength: 80,
    depth: 3,
};

/* Example 1 */
{
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
    log('EXAMPLE 1', map);
}

/* Example 2 */
{
    let map = new BigMap<any, number>([
        1, 15, 2, 3, 4, 5, 4, 5, 4, 5,
        'z', false, null, undefined,
    ]);
    map.set(15, 100);
    map.delete(5);
    log('EXAMPLE 2', map);
}

/* Example 3 */
{
    let map = BigMap.groupBy<number, { a?: number, b?: string }>('a', [
        { a: 2, b: '1' },
        { a: 2, b: '2' },
        { a: 3 },
        { a: 4 },
        { b: '3' },
        { b: '4' },
        { a: 2 },
    ]);
    log('EXAMPLE 3', map);
}

/* Example 4 */
{
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
    log('EXAMPLE 4', map);
}

function log(title: string, map: BigMap<any, any>) {
    console.log('\n', '- '.repeat(2) + title, '- '.repeat(15));
    console.log(`map.size =>`, map.size);
    console.log(`map.entries() =>`, map.entries());
}
