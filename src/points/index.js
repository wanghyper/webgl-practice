import BaseLayer from '../base';
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';
import Color from 'color';
export default class PointLayer extends BaseLayer {
    vertText = vertShader;
    fragText = fragShader;
    bufferData = [];
    constructor(container, options) {
        super(container, options);
    }

    processData() {
        let vertexData = [];
        let colorData = [];
        this.data.forEach(point => {
            let {x, y, z, color, size, style} = point.data;
            vertexData.push(x, y, z, size, style === 'rect' ? 1 : 0);
            color = Color(color).array();
            let [r, g, b, a = 1] = color;
            colorData.push(r, g, b, a * 255);
        });
        this.vertexData = vertexData;
        this.colorData = colorData;
        this.bindBuffer();
    }
    bindBuffer() {
        const gl = this.gl;
        this.bufferData = [];
        let byteLength = Float32Array.BYTES_PER_ELEMENT;
        let stride = byteLength * 5;
        let vertBuffer = gl.createBuffer();
        let vertBufferData = new Float32Array(this.vertexData);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertBufferData, gl.STATIC_DRAW);
        this.bufferData.push({
            buffer: vertBuffer,
            data: vertBufferData,
            attributes: [
                {name: 'aPos', size: 3, stride: stride},
                {name: 'aSize', size: 1, stride: stride, offset: byteLength * 3},
                {name: 'aStyle', size: 1, stride: stride, offset: byteLength * 4},
            ],
        });

        let colorBuffer = gl.createBuffer();
        let colorBufferData = new Uint8Array(this.colorData);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorBufferData, gl.STATIC_DRAW);
        this.bufferData.push({
            buffer: colorBuffer,
            data: colorBufferData,
            attributes: [{name: 'aColor', size: 4, type: this.gl.UNSIGNED_BYTE, normalize: true}],
        });
    }

    draw() {
        let gl = this.gl;
        let primitiveType = gl.POINTS; // 绘制类型
        let offset = 0; // 从缓冲读取时的偏移量
        let count = this.data.length; // 着色器运行次数
        gl.drawArrays(primitiveType, offset, count);
    }
}
