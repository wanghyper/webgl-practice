export default class Point {
    opts = {
        x: 0,
        y: 0,
        z: 0,
        color: '#000000ff',
        size: 5,
    };
    update = function () {};
    constructor(options) {
        this.opts = Object.assign(this.opts, options);
    }
    get data() {
        return this.opts;
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
    set x(value) {
        this.opts.x = value;
        this.update(this.opts);
    }
    set y(value) {
        this.opts.y = value;
        this.update(this.opts);
    }
    set z(value) {
        this.opts.z = value;
        this.update(this.opts);
    }
    set size(value) {
        this.opts.size = value;
        this.update(this.opts);
    }
    set color(value) {
        this.opts.color = value;
        this.update(this.opts);
    }
}
