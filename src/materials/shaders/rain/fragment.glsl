uniform sampler2D uDropTexture;

varying float vOpacity;

void main() {
    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    vec4 color = texture2D(uDropTexture, uv);
    gl_FragColor = vec4(color.rgb, color.a * vOpacity);
} 