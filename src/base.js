export default class GL {
    gl = null;
    opts = {};
    canvas = null;
    data = [];
    constructor(options) {
        this.opts = options || {};
    }
    initialize(canvas) {
        this.canvas = canvas;
        this.gl = getGLContext(canvas);
        this.initProgram(this.getShaders());
        if (this.opts.data) {
            this.setData(this.opts.data);
        }
    }
    setData(data) {
        if (!Array.isArray(data)) {
            data = [data];
        }
        this.data = data;
        if (this.gl) {
            this.init();
            this.render();
        }
    }

    bind(target) {
        this.setData(target.data);
        target.update = data => {
            this.setData(data);
        };
    }

    getShaders() {
        return {
            vs_source: '',
            fs_source: '',
        };
    }
    initProgram({gl = this.gl, vs_source, fs_source}) {
        // compile shaders
        let vertexShader = createShader(gl, vs_source, gl.VERTEX_SHADER);
        let fragmentShader = createShader(gl, fs_source, gl.FRAGMENT_SHADER);
        this.glProgram = createProgram(gl, vertexShader, fragmentShader);
        // use program
        gl.useProgram(this.glProgram);
    }
    destroy() {}
    render() {}
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
}
// 创建着色器 参数：gl上下文，着色器内容，类型
function createShader(gl, src, type) {
    // compile the vertex shader
    let shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader: ' + gl.getShaderInfoLog(shader));
    }
    return shader;
}
// 创建着色器程序，链接着色器
function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
function getGLContext(canvas) {
    let gl = null;
    let glContextNames = ['webgl', 'experimental-webgl'];
    for (let i = 0; i < glContextNames.length; i++) {
        try {
            gl = canvas.getContext(glContextNames[i]);
        } catch (e) {
            console.error('get gl context failed', e);
        }
        if (gl) {
            gl.clearColor(74 / 255, 115 / 255, 94 / 255, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(0, 0, canvas.width, canvas.height);
            break;
        }
    }
    return gl;
}
function resize(gl) {
    let realToCSSPixels = window.devicePixelRatio;

    // 获取浏览器显示的画布的CSS像素值
    // 然后计算出设备像素设置drawingbuffer
    let displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
    let displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

    // 检查画布尺寸是否相同
    if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
        // 设置为相同的尺寸
        gl.canvas.width = displayWidth;
        gl.canvas.height = displayHeight;
    }
}
