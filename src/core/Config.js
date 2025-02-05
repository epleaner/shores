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
    frequency: 0.144,   // Higher frequency for more rings
    amplitude: 0.4,    // Amplitude doesn't affect 2D waves much now
    opacity: 1,     // Lower opacity for more subtle white lines
    color: '#ffffff',  // Pure white color
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
    speed: 8,
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
    height: 100,
    count: 12000,
  },
};
