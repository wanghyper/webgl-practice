export default class Geometry {
    data = [];
    update = function () {};
    constructor(data = [], options) {
        this.data = data;
        this.opts = options;
    }
}
