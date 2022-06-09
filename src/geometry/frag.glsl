precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_textureSize;
uniform float u_useTexture;
varying vec2 vTexCoord;
varying vec4 vColor;

void main(void) {
    if (u_useTexture > 0.0) {
        //  gl_FragColor = texture2D(u_image, vTexCoord);
    } else {
         gl_FragColor = vColor;
    }
}