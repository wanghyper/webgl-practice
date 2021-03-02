import {getGLContext, initShaders, setupBuffer} from './index';
import vertShader from './shaders/points/vert.glsl';
import fragShader from './shaders/points/frag.glsl';

const canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;
const gl = getGLContext(canvas);
initShaders(gl, vertShader, fragShader);
let vertex = [
    0, 0, 0
];
setupBuffer(gl, vertex);
gl.drawArrays(gl.POINTS, 0, 1);