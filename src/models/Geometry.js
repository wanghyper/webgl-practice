export default class Geometry {
    data = [];
    update = function () {};
    constructor(vertexData = [], colorData = [], options) {
        this.vertexData = vertexData;
        this.colorData = colorData;
        this.opts = options;
    }
}
