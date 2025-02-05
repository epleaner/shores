export const vertexShader = `
uniform float uTime;
uniform float uWaveSpeed;
uniform float uWaveFrequency;
uniform float uWaveAmplitude;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
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

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Calculate distance from center (assuming island is at origin)
    float distance = length(modelPosition.xz);
    
    // Create waves using noise
    float wave = snoise(vec2(
        distance * uWaveFrequency + uTime * uWaveSpeed,
        distance * uWaveFrequency - uTime * uWaveSpeed
    ));
    
    // Apply wave height, decreasing amplitude as we get closer to the island
    float waveHeight = wave * uWaveAmplitude;
    waveHeight *= smoothstep(0.0, 20.0, distance); // Fade out near island
    
    modelPosition.y += waveHeight;

    // Calculate normal based on wave height
    vec3 transformed = modelPosition.xyz;
    vec3 objectNormal = normalize(vec3(
        snoise(vec2(transformed.x * uWaveFrequency + 0.1, transformed.z * uWaveFrequency + uTime * uWaveSpeed)) * uWaveAmplitude,
        1.0,
        snoise(vec2(transformed.x * uWaveFrequency - uTime * uWaveSpeed, transformed.z * uWaveFrequency)) * uWaveAmplitude
    ));
    
    vNormal = normalMatrix * objectNormal;
    vPosition = modelPosition.xyz;
    
    vec4 mvPosition = viewMatrix * modelPosition;
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShader = `
uniform vec3 uWaterColor;
uniform float uOpacity;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Base water color (darker)
    vec3 baseColor = vec3(0.0, 0.02, 0.05); // Very dark blue-black
    
    // Fresnel effect for reflectivity
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 5.0);
    
    // Add some subtle color variation based on waves
    float colorVariation = sin(vPosition.y * 2.0 + uTime) * 0.02;
    baseColor += colorVariation;
    
    // Specular highlight
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(max(0.0, dot(normal, halfDir)), 64.0);
    
    // Combine colors
    vec3 finalColor = mix(baseColor, vec3(1.0), specular * 0.5);
    finalColor = mix(finalColor, vec3(0.5, 0.6, 0.7), fresnel * 0.5);
    
    // Dynamic opacity based on view angle and waves
    float alpha = mix(uOpacity * 0.7, uOpacity, fresnel);
    alpha *= (0.95 + 0.05 * sin(uTime * 0.5));
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;
