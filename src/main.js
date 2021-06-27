// import Layer from './perspective-camera';
import Layer from './perspective-camera';
const canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;
const layer = new Layer(canvas);
layer.render();