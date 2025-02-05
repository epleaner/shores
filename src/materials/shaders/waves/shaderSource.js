export const vertexShader = `
uniform float uTime;
uniform float uWaveSpeed;
uniform float uWaveFrequency;
uniform float uWaveAmplitude;

varying float vDistance;
varying float vWaveIntensity;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Calculate distance from center (assuming island is at origin)
    float distance = length(modelPosition.xz);
    vDistance = distance;
    
    // Create wave pattern based on distance and time (reversed direction)
    float wave = sin(distance * uWaveFrequency + uTime * uWaveSpeed);
    vWaveIntensity = wave;
    
    // Keep y position flat - no vertical displacement
    modelPosition.y = 0.0;
    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
`;

export const fragmentShader = `
uniform vec3 uWaterColor;
uniform float uOpacity;
uniform float uTime;

varying float vDistance;
varying float vWaveIntensity;

void main() {
    // Create ultra-thin hairline effect with extremely tight smoothstep range
    float lineIntensity = smoothstep(0.997, 0.998, abs(vWaveIntensity));
    
    // Fade out intensity based on distance from island
    float distanceFade = smoothstep(0.0, 20.0, vDistance);
    
    // Combine for final opacity
    float alpha = lineIntensity * distanceFade * uOpacity;
    
    // Use pure white color
    vec3 finalColor = vec3(1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;
