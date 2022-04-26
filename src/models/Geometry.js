import {mat4, glMatrix} from 'gl-matrix';
import CommonModel from './CommonModel';
export default class Geometry extends CommonModel {
    matrix = mat4.create();

    transformStack = [];
    saveMatrix = null;
    saveTransformStack = [];
    constructor(data = [], options) {
        super();
        this.data = data;
        this.opts = options;
        this.save();
    }
    translate(vec3) {
        mat4.translate(this.matrix, this.matrix, vec3);
    }

    rotate(degree, rotateVec3) {
        mat4.rotate(this.matrix, this.matrix, glMatrix.toRadian(degree), rotateVec3);
    }

    save() {
        this.savedMatrix = mat4.clone(this.matrix);
    }

    restore() {
        this.matrix = mat4.clone(this.savedMatrix);
    }

    getComputedMatrix() {
        return mat4.clone(this.matrix);
    }

    draw() {
        this.layer.renderView();
    }
}
