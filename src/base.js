export default class GL {
    gl = null;
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = this.getGLContext();
        this.initProgram(this.getShaders());
    }
    getGLContext(canvas = this.canvas) {
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
