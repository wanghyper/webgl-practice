import GL from '../base';
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';

export default class Point extends GL {
    constructor(canvas) {
        super(canvas);
    }
    getShaders() {
        return {
            vs_source: vertShader,
            fs_source: fragShader,
        };
    }
    setupBuffer() {
        let vertex = [0, 0, 0];
        this.setupVertBuffer(vertex);
    }
    render() {
        this.setupBuffer();
        this.gl.drawArrays(this.gl.POINTS, 0, 1);
    }
}
