import {getProgram} from './gl';
import {mat4} from 'gl-matrix';
export default class BaseLayer {
    setDataTimer = null;
    gl = null;
    opts = {};
    canvas = null;
    data = [];
    bufferData = [];
    constructor(options) {
        this.opts = options || {};
    }
    initialize(canvas, gl) {
        this.canvas = canvas;
        this.gl = gl;
        this.glProgram = getProgram(gl, this.vertText, this.fragText);
        this.buffer = gl.createBuffer();

        let matrix = mat4.create();
        this.projectionMatrix = mat4.ortho(matrix, 0, this.canvas.clientWidth, this.canvas.clientHeight, 0, 100, -100);
        mat4.rotate(matrix, matrix, (20 / 180) * Math.PI, [0, 1, 0]);
    }
    getShaders() {
        return {
            vs_source: '',
            fs_source: '',
        };
    }
    update() {
        window.cancelAnimationFrame(this.setDataTimer);
        this.setDataTimer = window.requestAnimationFrame(() => {
            this.processData();
            this.render();
        });
    }

    setData(data) {
        if (!Array.isArray(data)) {
            data = [data];
        }
        this.data = data;
        this.update();
    }

    destroy() {}

    setBuffersAndAttributes() {
        const gl = this.gl;
        this.bufferData.forEach(item => {
            let {buffer, attributes} = item;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            attributes.forEach(item => {
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
        });
    }

    render() {
        const gl = this.gl;
        gl.useProgram(this.glProgram);
        this.setBuffersAndAttributes();
        let matrixUniformLocation = gl.getUniformLocation(this.glProgram, 'u_matrix');
        gl.uniformMatrix4fv(matrixUniformLocation, false, this.projectionMatrix);

        // gl.clear(gl.COLOR_BUFFER_BIT);
        this.draw();
    }
}
