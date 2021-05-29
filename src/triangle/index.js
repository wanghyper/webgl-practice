import GL from '../base';
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';

export default class Point extends GL {
    constructor(canvas) {
        super(canvas);
        var resolutionUniformLocation = this.gl.getUniformLocation(this.glProgram, 'u_resolution');
        // 设置全局变量 分辨率
        this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
    }
    getShaders() {
        return {
            vs_source: vertShader,
            fs_source: fragShader,
        };
    }
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    setVertex(gl = this.gl) {
        this.positionBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.aVertexPosition = gl.getAttribLocation(this.glProgram, 'a_pos');

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2; // 2 components per iteration
        var type = gl.FLOAT; // the data is 32bit floats
        var normalize = false;
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(this.aVertexPosition, size, type, normalize, stride, offset);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        // Turn on the color attribute
        this.aColorPosition = gl.getAttribLocation(this.glProgram, 'a_color');
        gl.vertexAttribPointer(this.aColorPosition, 4, gl.UNSIGNED_BYTE, true, stride, offset);
    }
    setupBuffer(gl = this.gl) {
        // 绘制50个随机颜色矩形
        for (var ii = 0; ii < 10; ++ii) {
            // 创建一个随机矩形
            // 并将写入位置缓冲
            // 因为位置缓冲是我们绑定在
            // `ARRAY_BUFFER`绑定点上的最后一个缓冲
            this.setRectangle(
                gl,
                // 点
                randomInt(300),
                randomInt(300),
                randomInt(300),
                randomInt(300),
                // 颜色
                Math.random() * 256,
                Math.random() * 256,
                Math.random() * 256,
                255
            );

            // 设置一个随机颜色

            // 绘制矩形
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 6;
            gl.drawArrays(primitiveType, offset, count);
        }
    }
    // 用参数生成矩形顶点并写进缓冲
    setRectangle(gl, x, y, width, height, r, g, b, a) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.aVertexPosition);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
            gl.STATIC_DRAW
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.enableVertexAttribArray(this.aColorPosition);
        let colorArr = new Array(6).fill([r, g, b, a])
        gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colorArr.flat()), gl.STATIC_DRAW);
    }
    render() {
        this.setVertex();
        this.setupBuffer();
    }
}
// 返回 0 到 range 范围内的随机整数
function randomInt(range) {
    return Math.floor(Math.random() * range);
}
