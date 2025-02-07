export const vertexShader = `
uniform float uTime;
uniform float uWaveSpeed;
uniform float uWaveFrequency;
uniform float uNoiseStrength;
uniform float uNoiseScale;
uniform float uNoiseSpeed;

varying float vDistance;
varying float vWaveIntensity;

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Calculate distance from center (assuming island is at origin)
    float distance = length(modelPosition.xz);
    vDistance = distance;
    
    // Add noise to the distance with configurable properties
    vec2 noiseCoord = modelPosition.xz * uNoiseScale;
    float distortionAmount = snoise(noiseCoord + uTime * uNoiseSpeed) * uNoiseStrength;
    
    // Create wave pattern based on distance and time with noise distortion
    float wave = sin((distance + distortionAmount) * uWaveFrequency + uTime * uWaveSpeed);
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
uniform float uThickness;

varying float vDistance;
varying float vWaveIntensity;

void main() {
    // Create ultra-thin hairline effect with configurable thickness
    float lineIntensity = smoothstep(1.0 - uThickness, 1.0 - (uThickness * 0.5), abs(vWaveIntensity));
    
    // Fade out intensity based on distance from island
    float distanceFade = smoothstep(0.0, 20.0, vDistance);
    
    // Combine for final opacity
    float alpha = lineIntensity * distanceFade * uOpacity;
    
    // Use pure white color
    vec3 finalColor = vec3(1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;
