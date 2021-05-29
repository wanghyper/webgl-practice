attribute vec2 a_pos;
attribute vec4 a_color;
uniform vec2 u_resolution;
varying vec4 v_color;

void main(void){
    v_color = a_color;
    // 从像素坐标转到 0 - 1
    vec2 zeroToOne = a_pos / u_resolution;
    // 再把 0 - 1 转到 0 - 2 再到 -1 - 1
    vec2 clipSpace = zeroToOne * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1.0);
}
