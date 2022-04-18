import GL from '../base';
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';
import Color from 'color';

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
            console.log(color);
            colorData.push(r, g, b, a * 255);
        });
        this.setupVertexBuffer(vertexData);
        this.setupColorBuffer(colorData);
        let resolutionUniformLocation = this.gl.getUniformLocation(this.glProgram, 'u_resolution');
        // 设置全局变量 分辨率
        this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
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
    setupBuffer(bufferData, attrArray) {
        const gl = this.gl;
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
        attrArray.forEach(item => {
            let {
                name,
                size = 2, // 每次迭代运行提取两个单位数据
                type = gl.FLOAT, // 每个单位的数据类型是32位浮点型
                normalize = false, // 不需要归一化数据
                stride = 0, // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                // 每次迭代运行运动多少内存到下一个数据开始点
                offset = 0, // 从缓冲起始位置开始读取
            } = item;
            let position = gl.getAttribLocation(this.glProgram, name);
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, size, type, normalize, stride, offset);
        });
    }
    render() {
        let gl = this.gl;
        let primitiveType = gl.POINTS; // 绘制类型
        let offset = 0; // 从缓冲读取时的偏移量
        let count = this.data.length; // 着色器运行次数
        gl.drawArrays(primitiveType, offset, count);
    }
}
