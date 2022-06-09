import {mat4, vec3} from 'gl-matrix';
import {getGLContext} from './gl';
export default class View {
    instances = [];
    enableMouseControl = true;
    projectionMatrix = null;
    originalMatrix = mat4.create();
    cameraMatrix = mat4.create();
    cameraPosition = [0, 0, 0];
    scenePostion = [0, 0, 0];

    constructor(element, options) {
        if (typeof container === 'string') {
            element = document.querySelector(element);
        }
        if (!(element instanceof HTMLElement)) {
            throw new TypeError('wrong html element！');
        }
        this.container = element;
        this.opts = options || {};
        this.enableMouseControl = !!this.opts.enableMouseControl;
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
                -this.canvas.clientHeight / 2,
                this.canvas.clientHeight / 2,
                1000,
                -1000
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
        this.originalMatrix = mat4.clone(this.projectionMatrix);
    }

    lookAt(eye, center, up) {
        this.cameraPosition = eye;
        this.scenePostion = center;
        this.up = up || [0, 0, 1];
        mat4.lookAt(this.cameraMatrix, this.cameraPosition, this.scenePostion, this.up);
        mat4.multiply(this.projectionMatrix, this.originalMatrix, this.cameraMatrix);
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            console.log('resize');
        });
        if (this.enableMouseControl) {
            this.canvas.addEventListener('mousedown', this.onMousedown.bind(this));
            this.canvas.addEventListener('mouseup', this.onMouseup.bind(this));
            this.canvas.addEventListener('mousemove', this.onMousemove.bind(this));
        }
    }

    onMousedown(e) {
        this.isMouseDown = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.alpha = this.moveX;
        this.theta = this.moveY;
        this.tempMatrix = mat4.clone(this.cameraMatrix);
    }
    onMouseup() {
        this.isMouseDown = false;
        this.startX = 0;
        this.startY = 0;
    }
    theta = 0;
    alpha = 0;
    onMousemove(e) {
        if (this.isMouseDown) {
            this.moveX = (e.clientX - this.startX) / (this.canvas.clientWidth / 2);
            this.moveY = (e.clientY - this.startY) / (this.canvas.clientHeight / 2);
            this.moveX = this.alpha + this.moveX * Math.PI
            this.moveY = this.theta + this.moveY * Math.PI;
            this.up = [
                Math.sin(this.theta) * Math.sin(this.alpha),
                Math.sin(this.theta) * Math.cos(this.alpha),
                Math.cos(this.theta),
            ];
            mat4.rotate(this.cameraMatrix, this.tempMatrix, this.moveX * Math.PI, this.up);
            mat4.multiply(this.projectionMatrix, this.originalMatrix, this.cameraMatrix);
            this.render();
        }
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
        mat4.rotate(this.projectionMatrix, this.projectionMatrix, (degree / 180) * Math.PI, vec3);
    }

    translate(vec3) {
        mat4.translate(this.projectionMatrix, this.projectionMatrix, vec3);
    }

    scale(vec3) {
        mat4.scale(this.projectionMatrix, this.projectionMatrix, vec3);
    }

    render() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.instances.forEach(instance => {
            instance.render();
        });
    }
}
