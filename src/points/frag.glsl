precision mediump float;
varying vec4 vColor;
varying float vStyle;

void main() {
    if (vStyle != 1.0) {
        if (distance(gl_PointCoord, vec2(0.5, 0.5)) > 0.5) {
            discard;
        }
    }
    gl_FragColor = vColor;
}