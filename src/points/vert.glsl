attribute vec2 aPos;
uniform vec2 u_resolution;

void main(void){
    // 从像素坐标转到 0 - 1
    vec2 zeroToOne = aPos / u_resolution;
    // 再把 0 - 1 转到 0 - 2 再到 -1 - 1
    vec2 clipSpace = zeroToOne * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1.0);
    gl_PointSize = 10.0;
}
