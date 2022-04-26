import {getGLContext} from './gl';
export default class View {
    instances = [];
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
        this.gl = getGLContext(this.canvas);
        this.bindEvents();
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

    render() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.instances.forEach(instance => {
            instance.render();
        });
    }
}
