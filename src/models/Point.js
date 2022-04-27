import CommonModel from './CommonModel';
export default class Point extends CommonModel {
    opts = {
        x: 0,
        y: 0,
        z: 0,
        color: '#000000ff',
        size: 5,
        style: 'rect',
    };
    constructor(options) {
        super(options);
        this.opts = Object.assign(this.opts, options);
    }
    clone() {
        return new Point(Object.assign({}, this.opts));
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
        this.update();
    }
    set y(value) {
        this.opts.y = value;
        this.update();
    }
    set z(value) {
        this.opts.z = value;
        this.update();
    }
    set size(value) {
        this.opts.size = value;
        this.update();
    }
    set color(value) {
        this.opts.color = value;
        this.update();
    }
}
