
 
export function getGLContext(canvas) {
    var gl = null;
    var glContextNames = ['webgl', 'experimental-webgl'];
    for (var i = 0; i < glContextNames.length; i++) {
        try {
            gl = canvas.getContext(glContextNames[i]);
        } catch (e) {}
        if (gl) {
            gl.clearColor(74 / 255, 115 / 255, 94 / 255, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(0, 0, canvas.width, canvas.height);
            break;
        }
    }
    return gl;
}
export function initShaders(gl, vs_source, fs_source) {
    // compile shaders  
    vertexShader = makeShader(gl, vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(gl, fs_source, gl.FRAGMENT_SHADER);
     
    // create program
    glProgram = gl.createProgram();
     
    // attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);
 
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program.");
    }
     
    // use program
    gl.useProgram(glProgram);
}
 
function makeShader(gl, src, type) {
    // compile the vertex shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
 
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

export function setupBuffer(gl, vertex){
   
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
 
    var aVertexPosition = gl.getAttribLocation(glProgram, 'aPos');
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);
}