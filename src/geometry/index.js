import BaseLayer from '../base';
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';
import Color from 'color';

export default class GeometryLayer extends BaseLayer {
    pointsLength = 0;
    vertexData = [];
    colorData = [];
    vertText = vertShader;
    fragText = fragShader;
    constructor(options) {
        super(options);
    }

    processData() {
        let vertexData = [];
        let colorData = [];
        this.pointsLength = 0;
        this.data.forEach(geometry => {
            let vertecies = geometry.data;
            vertecies.forEach(vertex => {
                vertexData.push(vertex[0], vertex[1], vertex[2]);
                this.pointsLength++;
                let color = vertex[3] || '#000';
                color = Color(color).array();
                let [r, g, b, a = 1] = color;
                colorData.push(r, g, b, a * 255);
            });
        });
        this.vertexData = vertexData;
        this.colorData = colorData;
        this.bindBuffer();
    }

    bindBuffer() {
        const gl = this.gl;
        this.bufferData = [];
        let vertBuffer = gl.createBuffer();
        let vertBufferData = new Float32Array(this.vertexData);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertBufferData, gl.STATIC_DRAW);
        this.bufferData.push({
            buffer: vertBuffer,
            data: vertBufferData,
            attributes: [{name: 'aPos', size: 3}],
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
    setUniforms(matrix) {
        const gl = this.gl;
        let matrixUniformLocation = gl.getUniformLocation(this.glProgram, 'u_matrix');
        gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    }
    draw() {
        let gl = this.gl;
        let primitiveType = gl.TRIANGLES; // 绘制类型
        let offset = 0; // 从缓冲读取时的偏移量
        let count = 0; // 着色器运行次数
        this.data.forEach(geometry => {
            let matrix = geometry.computeMatrix(this.projectionMatrix);
            this.setUniforms(matrix);
            count = geometry.data.length;
            gl.drawArrays(primitiveType, offset, count);
            offset += count;
        });
    }
}
