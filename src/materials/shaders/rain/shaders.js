export const vertexShader = `
uniform float uTime;
uniform float uSpeed;
uniform float uHeight;
uniform vec3 uPlayerPosition;

attribute float size;
attribute float randomness;
attribute float fadeOffset;

varying float vOpacity;

void main() {
    // Calculate base position
    vec3 pos = position;
    
    // Continuous fall with offset based on initial position
    float totalHeight = uHeight + 60.0;
    float yOffset = mod(uTime * uSpeed + randomness * totalHeight, totalHeight);
    
    // Move rain position relative to player's xz position
    pos.x += uPlayerPosition.x;
    pos.z += uPlayerPosition.z;
    pos.y = uPlayerPosition.y + uHeight - yOffset;
    
    // For line segments, calculate start and end points
    float isEnd = float(gl_VertexID % 2);
    if (isEnd > 0.5) {
        pos.y -= size;
    }
    
    // Calculate distance-based opacity with higher base opacity
    float distanceToPlayer = length(pos - uPlayerPosition);
    float heightFade = smoothstep(-30.0, 0.0, pos.y - uPlayerPosition.y);
    // Adjusted distance fade for larger area
    vOpacity = smoothstep(250.0, 50.0, distanceToPlayer) * heightFade * 0.8;
    
    // Project position
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Fixed small point size for points
    gl_PointSize = 1.0;
}
`;

export const fragmentShader = `
varying float vOpacity;

void main() {
    // Simple bright point/line
    gl_FragColor = vec4(1.0, 1.0, 1.0, vOpacity * 2.0);
}
`;
