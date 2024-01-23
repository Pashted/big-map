const softLimit = Math.pow(2, 24) - 1; // ~16.7M

class BigMap {
    constructor(arr = [], key) {
        this.maps = [];

        let tuples;
        if (key !== undefined)
            tuples = arr.map(obj => [ obj[key], obj ]);
        else if (arr[0] instanceof Array)
            tuples = arr.map(tuple => [ tuple[0], tuple[1] ]);
        else
            tuples = arr.map(primitive => [ primitive ]);

        tuples.reverse(); // iterate from the end to keep only last copies

        while (tuples.length) {
            let data = tuples.splice(0, softLimit).reverse()
                .filter(([ _key ]) => _key !== undefined && !this.has(_key));

            if (data.length)
                this.maps.unshift(new Map(data));
        }
        if (!this.maps.length)
            this.maps.push(new Map());
    }

    get root() {
        return this.maps[0];
    }

    get size() {
        return this.maps.reduce((sum, map) => sum + map.size, 0);
    }

    get(key) {
        let map = this.maps.find(map => map.has(key));
        if (map)
            return map.get(key);
    }

    set(key, value) {
        if (this.root.size >= softLimit) {
            this.maps.unshift(new Map());
            console.info('BigMap extended to', this.maps.length, 'maps with total', this.size, 'elements');
        }

        let map = this.maps.find(map => map.has(key)) || this.root;
        map.set(key, value);
        return this;
    }

    delete(key) {
        let map = this.maps.find(map => map.has(key)) || this.root;
        map.delete(key);
        return this;
    }

    clear() {
        this.maps.forEach(map => map.clear());
        this.maps = [ new Map() ];
        return this;
    }

    has(key) {
        return this.maps.some(map => map.has(key));
    }

    entries() {
        return this.maps.map(map => Array.from(map.entries())).flat();
    }

    keys() {
        return this.maps.map(map => Array.from(map.keys())).flat();
    }

    values() {
        return this.maps.map(map => Array.from(map.values())).flat();
    }
}

module.exports = BigMap;
