export function getGLContext(canvas, options) {
    let gl = null;
    let glContextNames = ['webgl', 'experimental-webgl'];
    for (let i = 0; i < glContextNames.length; i++) {
        try {
            gl = canvas.getContext(glContextNames[i], options);
        } catch (e) {
            console.error('get gl context failed', e);
        }
        if (gl) {
            gl.clearColor(0, 0, 0, 0);
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.viewport(0, 0, canvas.width, canvas.height);
            break;
        }
    }
    return gl;
}
export function getProgram(gl, vs_source, fs_source) {
    // compile shaders
    let vertexShader = createShader(gl, vs_source, gl.VERTEX_SHADER);
    let fragmentShader = createShader(gl, fs_source, gl.FRAGMENT_SHADER);
    return createProgram(gl, vertexShader, fragmentShader);
}
// 创建着色器 参数：gl上下文，着色器内容，类型
export function createShader(gl, src, type) {
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
export function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    let errInfo = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(errInfo);
}
