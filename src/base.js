export default class GL {
    gl = null;
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = this.getGLContext();
        this.initProgram(this.getShaders());
    }
    getGLContext(canvas = this.canvas) {
        var gl = null;
        var glContextNames = ['webgl', 'experimental-webgl'];
        for (var i = 0; i < glContextNames.length; i++) {
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
        const glProgram = (this.glProgram = createProgram(gl, vertexShader, fragmentShader));
        // use program
        gl.useProgram(glProgram);
    }
    setupVertBuffer(vertex) {
        const gl = this.gl;
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

        var aVertexPosition = gl.getAttribLocation(this.glProgram, 'aPos');
        gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexPosition);
    }
}
// 创建着色器 参数：gl上下文，着色器内容，类型
function createShader(gl, src, type) {
    // compile the vertex shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader: ' + gl.getShaderInfoLog(shader));
    }
    return shader;
}
// 创建着色器程序，链接着色器
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
