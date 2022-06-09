import BaseLayer from '../base';
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';
import Color from 'color';
import {createAndSetupTexture} from '../gl';

export default class GeometryLayer extends BaseLayer {
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
        this.data.forEach(geometry => {
            let vertecies = geometry.data;
            vertecies.forEach(vertex => {
                vertexData.push(vertex[0], vertex[1], vertex[2]);
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
    setModelUniforms(matrix) {
        const gl = this.gl;
        let matrixUniformLocation = gl.getUniformLocation(this.glProgram, 'u_modelMatrix');
        gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    }
    setModelTextures({texCoords, image, data}) {
        const length = data.length;
        const gl = this.gl;
        const program = this.glProgram;

        var useTextureSizeLocation = gl.getUniformLocation(program, 'u_useTexture');
        if (!texCoords || !image) {
            gl.uniform1f(useTextureSizeLocation, -1);
            return;
        }
        gl.uniform1f(useTextureSizeLocation, 1);

        var textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize');
        // 找到纹理的地址
        var texCoordLocation = gl.getAttribLocation(program, 'aTexCoord');
        if (!texCoords) {
            texCoords = new Array(length * 2).fill(-1);
        }
        // 给矩形提供纹理坐标
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        // 创建纹理
        createAndSetupTexture(gl);
        // 设置图像的大小
        gl.uniform2f(textureSizeLocation, image.width, image.height);
        // 将图像上传到纹理
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    draw() {
        let gl = this.gl;
        let primitiveType = gl.TRIANGLES; // 绘制类型
        let offset = 0; // 从缓冲读取时的偏移量
        let count = 0; // 着色器运行次数
        this.data.forEach(geometry => {
            let matrix = geometry.getComputedMatrix();
            this.setModelUniforms(matrix);
            this.setModelTextures(geometry);
            count = geometry.data.length;
            gl.drawArrays(primitiveType, offset, count);
            offset += count;
        });
    }
}
