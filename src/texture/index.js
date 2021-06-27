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
    getImage(url) {
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.src = url;
            image.crossOrigin = true;
            image.onload = function () {
                resolve(image);
            };
            image.onerror = e => {
                reject(e);
            };
        });
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
        // 创建一个随机矩形
        // 并将写入位置缓冲
        // 因为位置缓冲是我们绑定在
        // `ARRAY_BUFFER`绑定点上的最后一个缓冲
        this.setRectangle(
            gl,
            // 点
            100,
            100,
            300,
            300,
            // 颜色
            0,
            0,
            255,
            255
        );

        // 设置一个随机颜色

        // 绘制矩形
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
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
        let colorArr = new Array(6).fill([r, g, b, a]);
        gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colorArr.flat()), gl.STATIC_DRAW);
    }
    setTexture(image, gl = this.gl) {
        var textureSizeLocation = gl.getUniformLocation(this.glProgram, 'u_textureSize');
        let texCoordLocation = gl.getAttribLocation(this.glProgram, 'a_texCoord');
        // 设置图像的大小
        gl.uniform2f(textureSizeLocation, image.width, image.height);
        // 给矩形提供纹理坐标
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
            gl.STATIC_DRAW
        );
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        // 创建纹理
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // 设置参数，让我们可以绘制任何尺寸的图像
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // 将图像上传到纹理
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    async render() {
        let image = await this.getImage('./images/gold.png');
        this.setTexture(image);
        this.setVertex();
        this.setupBuffer();
    }
}
