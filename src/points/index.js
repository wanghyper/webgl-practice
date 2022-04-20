import GL from '../base';
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';
import Color from 'color';
import {m3} from '../transform/utils';
export default class PointLayer extends GL {
    constructor(container, options) {
        super(container, options);
    }
    getShaders() {
        return {
            vs_source: vertShader,
            fs_source: fragShader,
        };
    }
    init() {
        let data = this.data;
        let vertexData = [];
        let colorData = [];
        data.forEach(point => {
            let {x, y, z, color, size} = point;
            vertexData.push(x, y, z, size);
            color = Color(color).array();
            let [r, g, b, a = 1] = color;
            colorData.push(r, g, b, a * 255);
        });
        this.setupVertexBuffer(vertexData);
        this.setupColorBuffer(colorData);
        let matrix = m3.projection(this.canvas.clientWidth, this.canvas.clientHeight);
        let matrixUniformLocation = this.gl.getUniformLocation(this.glProgram, 'u_matrix');
        this.gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);
    }
    setupVertexBuffer(data) {
        let byteLength = Float32Array.BYTES_PER_ELEMENT;
        this.setupBuffer(new Float32Array(data), [
            {name: 'aPos', size: 3, stride: byteLength * 4},
            {name: 'aSize', size: 1, stride: byteLength * 4, offset: byteLength * 3},
        ]);
    }
    setupColorBuffer(data) {
        this.setupBuffer(new Uint8Array(data), [
            {name: 'aColor', size: 4, type: this.gl.UNSIGNED_BYTE, normalize: true},
        ]);
    }

    render() {
        let gl = this.gl;
        // Clear the canvas.
        this.gl.clear(gl.COLOR_BUFFER_BIT);
        let primitiveType = gl.POINTS; // 绘制类型
        let offset = 0; // 从缓冲读取时的偏移量
        let count = this.data.length; // 着色器运行次数
        gl.drawArrays(primitiveType, offset, count);
    }
}
