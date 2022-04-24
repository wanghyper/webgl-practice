attribute vec3 aPos;
attribute vec4 aColor;
varying vec4 vColor;
uniform mat4 u_matrix;

void main(void){
    gl_Position = u_matrix * vec4(aPos, 1.0);
    vColor = aColor;
}
