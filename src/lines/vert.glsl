attribute vec4 aPos;
attribute vec4 aColor;
varying vec4 vColor;
uniform mat4 u_matrix;
uniform mat4 u_modelMatrix;

void main(void){
    gl_Position = u_matrix * u_modelMatrix * aPos;
    vColor = aColor;
}
