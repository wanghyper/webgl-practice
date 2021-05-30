precision mediump float;
// 纹理
uniform sampler2D u_image;
uniform vec2 u_textureSize;
// 纹理坐标
varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    // 计算1像素对应的纹理坐标
   vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;

    // 在纹理上寻找对应颜色值
    // gl_FragColor = texture2D(u_image, v_texCoord).bgra;
    // 对左中右像素求均值
    gl_FragColor = (
       texture2D(u_image, v_texCoord) +
       texture2D(u_image, v_texCoord + vec2(onePixel.x, 0.0)) +
       texture2D(u_image, v_texCoord + vec2(-onePixel.x, 0.0))) / 3.0; 
}