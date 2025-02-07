export const vertexShader = `
uniform float uTime;
uniform float uWaveSpeed;
uniform float uWaveFrequency;
uniform float uNoiseStrength;
uniform float uNoiseScale;
uniform float uNoiseSpeed;

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

varying float vDistance;
varying float vWaveIntensity;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Calculate angle around the circle (normalized to [0, 2π])
    float angle = atan(modelPosition.z, modelPosition.x);
    angle = angle < 0.0 ? angle + 2.0 * 3.14159 : angle;
    
    // Calculate base distance from center
    highp float distance = length(modelPosition.xz);
    
    // Create smooth noise with larger features
    vec2 baseNoiseCoord = vec2(angle * uNoiseScale * 0.5, uTime * uNoiseSpeed);
    float noise1 = snoise(baseNoiseCoord) * 0.7;
    float noise2 = snoise(baseNoiseCoord * 1.5) * 0.2;
    float noise3 = snoise(baseNoiseCoord * 2.0) * 0.1;
    
    // Combine noise samples for smooth result
    float smoothNoise = (noise1 + noise2 + noise3) * uNoiseStrength;
    
    // Apply smooth noise to distance
    distance += smoothNoise;
    vDistance = distance;
    
    // Create wave pattern with better precision
    highp float phase = distance * uWaveFrequency * 3.0 + uTime * uWaveSpeed;
    highp float wave = sin(phase);
    vWaveIntensity = wave;
    
    // Keep y position flat - no vertical displacement
    modelPosition.y = 0.0;
    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
`;

export const fragmentShader = `
uniform float uOpacity;
uniform float uThickness;

varying float vDistance;
varying float vWaveIntensity;

void main() {
    // Create ultra-thin line with smoother transition
    // To make lines thicker: increase the second parameter (e.g., 0.002 -> 0.005 for thicker, 0.001 for thinner)
    // The first parameter should stay 0.0, the second parameter controls thickness
    float lineIntensity = 1.0 - smoothstep(0.0, uThickness, abs(vWaveIntensity));
    
    // Fade out intensity based on distance from island
    float distanceFade = smoothstep(0.0, 20.0, vDistance);
    
    // Combine for final opacity
    float alpha = lineIntensity * distanceFade * uOpacity;
    
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
`;
