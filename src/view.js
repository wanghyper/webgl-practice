import {mat4} from 'gl-matrix';
import {getGLContext} from './gl';
export default class View {
    instances = [];
    projectionMatrix = null;
    originalMatrix = mat4.create();
    constructor(element, options) {
        if (typeof container === 'string') {
            element = document.querySelector(element);
        }
        if (!(element instanceof HTMLElement)) {
            throw new TypeError('wrong html element！');
        }
        this.opts = options || {};
        this.data = this.opts.data || [];
        this.canvas = document.createElement('canvas');
        let width = element.clientWidth;
        let height = element.clientHeight;
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.background = 'transparent';
        // this.canvas.style.height = height;
        element.appendChild(this.canvas);
        this.gl = getGLContext(this.canvas, options);
        this.setProjectionMatrix();
        this.bindEvents();
    }

    setProjectionMatrix() {
        if (this.opts.projectionType === 'ortho') {
            this.projectionMatrix = mat4.ortho(
                this.originalMatrix,
                -this.canvas.clientWidth / 2,
                this.canvas.clientWidth / 2,
                this.canvas.clientHeight / 2,
                -this.canvas.clientHeight / 2,
                400,
                -400
            );
        } else {
            this.projectionMatrix = mat4.perspective(
                this.originalMatrix,
                (45 * Math.PI) / 180,
                this.canvas.clientWidth / this.canvas.clientHeight,
                0.1,
                10000
            );
        }
    }

    lookAt(eye, center, up) {
        mat4.lookAt(this.projectionMatrix, eye, center, up || [0, 1, 0]);
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            console.log('resize');
        });
    }

    add(instance) {
        this.instances.push(instance);
        instance.initialize(this.canvas, this.gl);
        instance.setView(this);
    }

    remove(instance) {
        let index = this.instances.indexOf(instance);
        if (index > -1) {
            this.instances.splice(index, 1);
            instance.destroy();
        }
    }

    rotate(degree, vec3) {
        this.instances.forEach(instance => {
            instance.rotate(degree, vec3);
        });
    }

    translate(vec3) {
        this.instances.forEach(instance => {
            instance.translate(vec3);
        });
    }

    scale(vec3) {
        this.instances.forEach(instance => {
            instance.scale(vec3);
        });
    }

    render() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.instances.forEach(instance => {
            instance.render();
        });
    }
}
