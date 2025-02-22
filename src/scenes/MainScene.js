import * as THREE from 'three';
import Config from '../core/Config.js';
import ShootingStar from '../components/ShootingStar.js';
import Rain from '../components/Rain.js';
import Waves from '../components/Waves.js';
import GUI from '../core/GUI.js';
import Experience from '../core/Experience.js';

export default class MainScene {
  constructor(renderer) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000); // Pure black background

    // Add more ambient light for better diffusion
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // Increased from 0.05 to 0.2
    this.scene.add(ambientLight);

    // Create visible sun sphere - much larger and farther away
    const sunGeometry = new THREE.SphereGeometry(0, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(100, 200, -300); // Much farther away
    this.scene.add(sun);

    // Add light from the sun position
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.1);
    sunLight.position.copy(sun.position);
    this.scene.add(sunLight);

    // Calculate the visible section
    const radius = Config.world.sphereRadius;
    const angle = Config.world.visibleSectionAngle;

    // Create a sphere section
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      256, // Increased segments for smoother surface
      256,
      0,
      Math.PI * 2,
      0,
      angle
    );

    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 0.3, // Reduced metalness for smoother look
      roughness: 0.4, // Balanced roughness
      clearcoat: 0.3, // Reduced clearcoat
      clearcoatRoughness: 0.4, // Smoother clearcoat
      reflectivity: 0.7,
      side: THREE.DoubleSide,
      flatShading: false, // Ensure smooth shading
    });

    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphere.position.y = -radius + 1.5;

    this.scene.add(this.sphere);

    // Store camera reference from Experience
    this.camera = new Experience().camera.camera;

    // Initialize arrays for effects
    this.shootingStars = [];
    this.rain = [];

    // Effect states
    this.effectsEnabled = {
      shootingStars: false,
      rain: true,
      waves: true,
    };

    // Add waves
    this.waves = new Waves(this.scene, Config.world.sphereRadius * 1.5);

    // Initialize GUI
    this.gui = new GUI(this);
  }

  toggleShootingStars(enabled) {
    this.effectsEnabled.shootingStars = enabled;
    if (!enabled) {
      // Remove all existing shooting stars
      this.shootingStars.forEach((star) => star.dispose());
      this.shootingStars = [];
    }
  }

  toggleRain(enabled) {
    this.effectsEnabled.rain = enabled;
    if (!enabled) {
      // Remove all existing rain drops
      this.rain.forEach((drop) => drop.dispose());
      this.rain = [];
    }
  }

  toggleWaves(enabled) {
    this.effectsEnabled.waves = enabled;
    if (this.waves) {
      this.waves.mesh.visible = enabled;
    }
  }

  update() {
    // Update shooting stars
    if (this.effectsEnabled.shootingStars) {
      if (Math.random() < Config.shootingStars.spawnRate) {
        this.shootingStars.push(new ShootingStar(this.scene));
      }

      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const star = this.shootingStars[i];
        const isAlive = star.update();

        if (!isAlive) {
          star.dispose();
          this.shootingStars.splice(i, 1);
        }
      }
    }

    // Update rain
    if (this.effectsEnabled.rain) {
      // Only create rain system once when enabled
      if (!this.rainSystem && this.effectsEnabled.rain) {
        this.rainSystem = new Rain(this.scene, this.camera);
      }

      // Update existing system
      if (this.rainSystem) {
        this.rainSystem.update();
      }
    }

    // Update waves
    if (this.effectsEnabled.waves && this.waves) {
      this.waves.update(performance.now() * 0.001);
    }
  }

  // Helper to get position on sphere surface
  getPointOnSphere(x, z, radius = 10) {
    const y = Math.sqrt(Math.max(0, radius * radius - x * x - z * z));
    return new THREE.Vector3(x, y, z);
  }
}
