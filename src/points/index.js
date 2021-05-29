import GL from '../base';
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';

export default class Point extends GL {
    constructor(canvas) {
        super(canvas);
    }
    getShaders() {
        return {
            vs_source: vertShader,
            fs_source: fragShader,
        };
    }
    setupBuffer(gl = this.gl) {
        let vertex = [
            10, 10,
            20, 20,
            30, 30
        ];
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

        let aVertexPosition = gl.getAttribLocation(this.glProgram, 'aPos');
        var size = 2; // 每次迭代运行提取两个单位数据
        var type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
        var normalize = false; // 不需要归一化数据
        var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
        // 每次迭代运行运动多少内存到下一个数据开始点
        var offset = 0; // 从缓冲起始位置开始读取
        gl.vertexAttribPointer(aVertexPosition, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(aVertexPosition);
        // 一个隐藏信息是gl.vertexAttribPointer是将属性绑定到当前的ARRAY_BUFFER。
        // 换句话说就是属性绑定到了positionBuffer上。这也意味着现在利用绑定点随意将
        // ARRAY_BUFFER绑定到其它数据上后，该属性依然从positionBuffer上读取数据。
    
        var resolutionUniformLocation = gl.getUniformLocation(this.glProgram, "u_resolution");
        // 设置全局变量 分辨率
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    }
    render() {
        let gl = this.gl;
        this.setupBuffer();
        var primitiveType = gl.POINTS; // 绘制类型
        var offset = 0; // 从缓冲读取时的偏移量
        var count = 3; // 着色器运行次数
        gl.drawArrays(primitiveType, offset, count);
    }
}
