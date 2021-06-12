import GL from '../base';
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';
import {m3} from './utils';

export default class Point extends GL {
    constructor(canvas) {
        super(canvas);
        const gl = this.gl;
        // lookup uniforms
        let resolutionLocation = gl.getUniformLocation(this.glProgram, 'u_resolution');
        let colorLocation = gl.getUniformLocation(this.glProgram, 'u_color');
        this.matrixLocation = gl.getUniformLocation(this.glProgram, 'u_matrix');

        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        let color = [1, 1, 1, 1];
        // set the color
        gl.uniform4fv(colorLocation, color);
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
        this.aVertexPosition = gl.getAttribLocation(this.glProgram, 'a_position');
        gl.enableVertexAttribArray(this.aVertexPosition);
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2; // 2 components per iteration
        let type = gl.FLOAT; // the data is 32bit floats
        let normalize = false;
        let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(this.aVertexPosition, size, type, normalize, stride, offset);
    }
    setupBuffer(gl = this.gl) {
        // Fill the buffer with the values that define a letter 'F'.
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                // left column
                0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

                // top rung
                30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

                // middle rung
                30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
            ]),
            gl.STATIC_DRAW
        );
    }

    draw(gl = this.gl) {
        var matrix = m3.identity();
        // 计算矩阵
        var projectionMatrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.multiply(projectionMatrix, matrix);
        for (var i = 0; i < 5; ++i) {
            // Multiply the matrices.
            matrix = m3.translate(matrix, 50, 50);
            matrix = m3.rotate(matrix, (10 / 180) * Math.PI);
            matrix = m3.scale(matrix, 1, 1);

            // Set the matrix.
            gl.uniformMatrix3fv(this.matrixLocation, false, matrix);

            // Draw the geometry.
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 18; // 6 triangles in the 'F', 3 points per triangle
            gl.drawArrays(primitiveType, offset, count);
        }
    }

    async render() {
        this.setVertex();
        this.setupBuffer();
        this.draw();
    }
}
