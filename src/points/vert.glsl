attribute vec3 aPos;
void main(void){
    gl_Position = vec4(aPos, 1.0);
    gl_PointSize = 10.0;
}
