attribute vec3 aPos;
attribute float aSize;
attribute vec4 aColor;
attribute float aStyle;
varying vec4 vColor;
varying float vStyle;
uniform mat4 u_matrix;

void main(void){
    gl_Position = u_matrix * vec4(aPos, 1.0);
    gl_PointSize = aSize;
    vStyle = aStyle;
    vColor = aColor;
}
