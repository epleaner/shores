uniform float uTime;
uniform float uSpeed;
uniform float uHeight;
uniform vec3 uPlayerPosition;

attribute float size;
attribute float randomness;
attribute float fadeOffset;

varying float vOpacity;

void main() {
    // Calculate position
    vec3 pos = position;
    
    // Move rain down based on time
    float yOffset = mod(uTime * uSpeed * (0.9 + randomness * 0.2), uHeight);
    pos.y = uPlayerPosition.y + uHeight - yOffset;
    
    // Calculate distance-based opacity
    float distanceToPlayer = length(pos - uPlayerPosition);
    vOpacity = smoothstep(100.0, 0.0, distanceToPlayer) * (0.3 + fadeOffset * 0.2);
    
    // Project position
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = size * (300.0 / -mvPosition.z);
} 