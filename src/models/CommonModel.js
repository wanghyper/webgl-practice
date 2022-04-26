export default class CommonModel {
    layer = null;

    update() {
        if (this.layer) {
            this.layer.update();
        }
    }
    setLayer(layer) {
        this.layer = layer;
    }
}
