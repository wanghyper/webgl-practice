precision mediump float;

attribute vec4 aPos;
attribute vec4 aColor;
attribute vec2 aTexCoord;
varying vec4 vColor;
varying vec2 vTexCoord;
uniform mat4 u_matrix;
uniform mat4 u_modelMatrix;
uniform float u_useTexture;

void main(void){
    gl_Position = u_matrix * u_modelMatrix * aPos;
    vColor = aColor;
    if (u_useTexture > 0.0) {
        // vTexCoord = aTexCoord;
    }
    
}
