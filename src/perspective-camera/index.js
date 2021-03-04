import {mat4} from 'gl-matrix';
import GL from '../base';
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';

export default class Perspective extends GL {
    constructor(canvas) {
        super(canvas);
    }
    getShaders() {
        return {
            vs_source: vertShader,
            fs_source: fragShader
        };
    }
    
    setupBuffer(){
        const gl = this.gl;
        const glProgram = this.glProgram;
        var cubicVertex = [
            // front vertex
            -10, 0, 10,
            10, 0, 10,
            10, 20, 10,
            -10, 20, 10,
            // back vertex
            -10, 0, -10,
            10, 0, -10,
            10, 20, -10,
            -10, 20, -10
        ];
        
        var vertexColor = [
            0.9, 0.5, 0.1,
            0.4, 0.3, 0.1,
            0.1, 0.3, 0.2,
            0.4, 0.5, 0.7,
            0.4, 0.9, 0.1,
            0.2, 0.5, 0.5,
            0.4, 0.6, 0.1,
            0.4, 0.5, 0.8
        ];
        
        var vertexIndex = this.vertexIndex = [
            // front face
            0, 1, 2,
            0, 2, 3,
            // right face
            1, 5, 6,
            1, 6, 2,
            // back face
            5, 4, 7,
            5, 7, 6,
            // left face
            4, 0, 3,
            4, 3, 7,
            // top face
            3, 2, 6,
            3, 6, 7,
            // bottom face
            4, 5, 1,
            4, 1, 0
        ];
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubicVertex), gl.STATIC_DRAW);
    
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndex), gl.STATIC_DRAW);
    
        var aVertexPosition = gl.getAttribLocation(glProgram, 'aPos');
    
        gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexPosition);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColor), gl.STATIC_DRAW);
    
        var aColorPosition = gl.getAttribLocation(glProgram, 'aColor');
        gl.vertexAttribPointer(aColorPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aColorPosition);
    }
    render() {
        const glProgram = this.glProgram;
        const gl = this.gl;
        glProgram.pMatrixUniform = gl.getUniformLocation(glProgram, 'uPMatrix');
        glProgram.mvMatrixUniform = gl.getUniformLocation(glProgram, 'uMVMatrix');

        var pMatrix = mat4.create();
        var mvMatrix = mat4.create();
        let {width, height} = this.canvas;
        var widthHeightRatio = width / height;
        var fovy = 40;
        var near = 10;
        var far = 100;
        mat4.perspective(pMatrix, toRadian(fovy), widthHeightRatio, near, far);
        mat4.identity(mvMatrix, mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, [0, -5, -70]);
        mat4.rotate(mvMatrix, mvMatrix, toRadian(45), [0, 1, 0]);
        gl.uniformMatrix4fv(glProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(glProgram.mvMatrixUniform, false, mvMatrix);
        this.setupBuffer();
        gl.drawElements(gl.TRIANGLES, this.vertexIndex.length, gl.UNSIGNED_SHORT, 0);
    }
}

function toRadian(angle) {
    return angle * Math.PI / 180;
}