attribute vec3 aPos;
attribute vec3 aColor;
varying vec3 vColor;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
void main(void){
    gl_Position = uPMatrix * uMVMatrix * vec4(aPos, 1);
    vColor = aColor;
}