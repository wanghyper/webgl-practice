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
        // this.canvas.style.width = width;
        // this.canvas.style.height = height;
        element.appendChild(this.canvas);
    }

    add(instance) {
        this.instances.push(instance);
        instance.initialize(this.canvas);
        instance.render();
    }

    remove(instance) {
        let index = this.instances.indexOf(instance);
        if (index > -1) {
            this.instances.splice(index, 1);
            instance.destroy();
        }
    }
}
