export default class Point {
    opts = {
        x: 0,
        y: 0,
        z: 0,
        color: '#000000ff',
        size: 5,
    };
    constructor(options) {
        this.opts = Object.assign(this.opts, options);
    }
    get x() {
        return this.opts.x;
    }
    get y() {
        return this.opts.y;
    }
    get z() {
        return this.opts.z;
    }
    get size() {
        return this.opts.size;
    }
    get color() {
        return this.opts.color;
    }
}
