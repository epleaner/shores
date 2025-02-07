export default {
  player: {
    headHeight: 8.5,
    moveSpeed: 0.5,
  },
  world: {
    sphereRadius: 100,
    visibleSectionAngle: Math.PI / 6,
    visibleSectionSize: 50,
  },
  waves: {
    speed: 0.5,        // Faster speed for more movement
    frequency: 0.04,   // Higher frequency for more rings
    opacity: 1,        // Lower opacity for more subtle white lines
    color: '#ffffff',  // Pure white color
    thickness: 0.05,  // Controls the thickness of the wave lines
    noiseStrength: 15,    // How much the noise distorts the waves
    noiseScale: 5,      // Size of the noise pattern
    noiseSpeed: 0.1,       // Speed of noise animation
  },
  shootingStars: {
    spawnRate: 0.05,
    radius: 750, // Adjusted for better visibility
    size: 1,
    speed: 5, // Adjusted for tangential movement
    lightIntensity: {
      min: 300,
      max: 400,
    },
    lightRange: 6000,
    fadeSpeed: {
      min: 0.006,
      max: 0.01,
    },
    trailLength: 10, // Adjusted trail length
  },
  rain: {
    spawnRate: 0.11,
    size: 0.2,
    speed: 2.3,
    lightIntensity: {
      min: 0.05,
      max: 0.1,
    },
    lightRange: 50,
    fadeSpeed: {
      min: 0.01,
      max: 0.02,
    },
    spread: {
      x: 300,
      z: 300,
    },
    height: 200,
    count: 6000,
  },
};
