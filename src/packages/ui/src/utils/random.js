export default class Prando {
    private static readonly MIN = -2147483648;
    private static readonly MAX = 2147483647;

    private _seed;
    private _value = NaN;

    constructor(seed) {
        if (typeof seed === 'string') {
            this._seed = this.hashCode(seed);
        } else if (typeof seed === 'number') {
            this._seed = this.getSafeSeed(seed);
        } else {
            this._seed = this.getSafeSeed(
                Prando.MIN + Math.floor((Prando.MAX - Prando.MIN) * Math.random())
            );
        }
        this.reset();
    }

    public next(min = 0, pseudoMax = 1) {
        this.recalculate();
        return this.map(this._value, Prando.MIN, Prando.MAX, min, pseudoMax);
    }

    public nextInt(min = 10, max = 100) {
        this.recalculate();
        return Math.floor(
            this.map(this._value, Prando.MIN, Prando.MAX, min, max + 1)
        );
    }

    public nextString(
        length = 16,
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    ) {
        let str = '';
        while (str.length < length) {
            str += this.nextChar(chars);
        }
        return str;
    }

    public nextChar(
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    ) {
        return chars.substr(this.nextInt(0, chars.length - 1), 1);
    }

    public nextArrayItem(array) {
        return array[this.nextInt(0, array.length - 1)];
    }

    public nextBoolean() {
        this.recalculate();
        return this._value > 0.5;
    }

    public skip(iterations = 1) {
        while (iterations-- > 0) {
            this.recalculate();
        }
    }

    public reset() {
        this._value = this._seed;
    }

    private recalculate() {
        this._value = this.xorshift(this._value);
    }

    private xorshift(value) {
        value ^= value << 13;
        value ^= value >> 17;
        value ^= value << 5;
        return value;
    }

    private map(val, minFrom, maxFrom, minTo, maxTo) {
        return (
            ((val - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo
        );
    }

    private hashCode(str) {
        let hash = 0;
        if (str) {
            const l = str.length;
            for (let i = 0; i < l; i++) {
                hash = (hash << 5) - hash + str.charCodeAt(i);
                hash |= 0;
                hash = this.xorshift(hash);
            }
        }
        return this.getSafeSeed(hash);
    }

    private getSafeSeed(seed) {
        if (seed === 0) return 1;
        return seed;
    }
}
