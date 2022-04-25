import {mat4} from 'gl-matrix';
import CommonModel from './CommonModel';
export default class Geometry extends CommonModel {
    matrix = mat4.create();
    translateVec3 = [0, 0, 0];
    constructor(data = [], options) {
        super();
        this.data = data;
        this.opts = options;
    }
    translate(vec3) {
        this.translateVec3 = [vec3[0], vec3[1] || 0, vec3[2] || 0];
        this.layer.render();
    }

    rotateY() {}

    computeMatrix(projectMatrix) {
        mat4.translate(this.matrix, projectMatrix, this.translateVec3);
        // mat4.rotate(this.matrix, projectMatrix, (20 / 180) * Math.PI, [0, 1, 0]);
        return this.matrix;
    }
}
