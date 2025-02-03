export default {
    player: {
        headHeight: 8.5,
        moveSpeed: 0.1,
    },
    world: {
        sphereRadius: 100,
        visibleSectionAngle: Math.PI / 6,
        visibleSectionSize: 50
    },
    shootingStars: {
        spawnRate: 0.05,
        radius: 750,         // Adjusted for better visibility
        size: 1,
        speed: 5,           // Adjusted for tangential movement
        lightIntensity: {
            min: 300,
            max: 400
        },
        lightRange: 6000,
        fadeSpeed: {
            min: 0.006,
            max: 0.01
        },
        trailLength: 10     // Adjusted trail length
    },
    rain: {
        spawnRate: 0.11,
        size: .89,
        speed: 4,           // Slightly slower for better visibility
        lightIntensity: {
            min: 0.05,
            max: 0.1
        },
        lightRange: 50,
        fadeSpeed: {
            min: 0.01,
            max: 0.02
        },
        trailLength: 5,      // Slightly longer trails
        spread: {
            x: 100,          // Wider spread
            z: 100
        },
        height: 80,          // Higher spawn point
        count: 500           // More raindrops
    }
} 