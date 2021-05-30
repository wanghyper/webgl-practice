attribute vec2 a_pos;
attribute vec4 a_color;
attribute vec2 a_texCoord;
uniform vec2 u_resolution;
varying vec4 v_color;
varying vec2 v_texCoord;

void main(void){
    // 将纹理坐标传给片断着色器
    // GPU会在点之间进行插值
    v_texCoord = a_texCoord;

    v_color = a_color;
    // 从像素坐标转到 0 - 1
    vec2 zeroToOne = a_pos / u_resolution;
    // 再把 0 - 1 转到 0 - 2 再到 -1 - 1
    vec2 clipSpace = zeroToOne * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1.0);
}
