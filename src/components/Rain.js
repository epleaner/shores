import * as THREE from 'three';
import Config from '../core/Config.js';
import {
  vertexShader,
  fragmentShader,
} from '../materials/shaders/rain/shaders.js';

export default class Rain {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.count = Config.rain.count;

    this.initRainSystem();
  }

  initRainSystem() {
    // Create geometry for points
    const geometry = new THREE.BufferGeometry();

    // Generate random positions within the spawn box
    const positions = new Float32Array(this.count * 3);
    const sizes = new Float32Array(this.count);
    const randomness = new Float32Array(this.count);
    const fadeOffsets = new Float32Array(this.count);

    this.updateRainAttributes(positions, sizes, randomness, fadeOffsets);

    // Create line geometry (two vertices per raindrop)
    const linePositions = new Float32Array(this.count * 6); // 2 points per line * 3 coordinates
    const lineSizes = new Float32Array(this.count * 2);
    const lineRandomness = new Float32Array(this.count * 2);
    const lineFadeOffsets = new Float32Array(this.count * 2);

    for (let i = 0; i < this.count; i++) {
      const i6 = i * 6;
      const i2 = i * 2;
      const i3 = i * 3;

      // Copy position to both start and end points
      linePositions[i6] = positions[i3];
      linePositions[i6 + 1] = positions[i3 + 1];
      linePositions[i6 + 2] = positions[i3 + 2];
      linePositions[i6 + 3] = positions[i3];
      linePositions[i6 + 4] = positions[i3 + 1];
      linePositions[i6 + 5] = positions[i3 + 2];

      // Copy attributes to both vertices
      lineSizes[i2] = sizes[i];
      lineSizes[i2 + 1] = sizes[i];
      lineRandomness[i2] = randomness[i];
      lineRandomness[i2 + 1] = randomness[i];
      lineFadeOffsets[i2] = fadeOffsets[i];
      lineFadeOffsets[i2 + 1] = fadeOffsets[i];
    }

    // Set up geometries
    this.positions = positions;
    this.sizes = sizes;
    this.randomness = randomness;
    this.fadeOffsets = fadeOffsets;
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute(
      'randomness',
      new THREE.BufferAttribute(randomness, 1)
    );
    geometry.setAttribute(
      'fadeOffset',
      new THREE.BufferAttribute(fadeOffsets, 1)
    );

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3)
    );
    lineGeometry.setAttribute('size', new THREE.BufferAttribute(lineSizes, 1));
    lineGeometry.setAttribute(
      'randomness',
      new THREE.BufferAttribute(lineRandomness, 1)
    );
    lineGeometry.setAttribute(
      'fadeOffset',
      new THREE.BufferAttribute(lineFadeOffsets, 1)
    );

    // Create material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: Config.rain.speed },
        uHeight: { value: Config.rain.height },
        uPlayerPosition: { value: this.camera.position },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Create points and lines
    this.points = new THREE.Points(geometry, this.material);
    this.lines = new THREE.LineSegments(lineGeometry, this.material);

    this.scene.add(this.points);
    this.scene.add(this.lines);
  }

  updateRainAttributes(positions, sizes, randomness, fadeOffsets) {
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * Config.rain.spread.x;
      positions[i3 + 1] = Math.random() * Config.rain.height;
      positions[i3 + 2] = (Math.random() - 0.5) * Config.rain.spread.z;
      sizes[i] = Config.rain.size;
      randomness[i] = Math.random();
      fadeOffsets[i] = Math.random();
    }
  }

  updateUniforms() {
    if (this.material) {
      this.material.uniforms.uSpeed.value = Config.rain.speed;
      this.material.uniforms.uHeight.value = Config.rain.height;
    }
  }

  updateAttributes() {
    if (this.points && this.positions && this.sizes) {
      this.updateRainAttributes(this.positions, this.sizes, this.randomness, this.fadeOffsets);
      this.points.geometry.attributes.position.needsUpdate = true;
      this.points.geometry.attributes.size.needsUpdate = true;
      this.lines.geometry.attributes.position.needsUpdate = true;
      this.lines.geometry.attributes.size.needsUpdate = true;
    }
  }

  update() {
    if (!this.material) return;

    // Update uniforms
    this.material.uniforms.uTime.value += 0.016;
    this.material.uniforms.uPlayerPosition.value.copy(this.camera.position);
    
    // Update other properties from Config
    this.updateUniforms();
  }

  dispose() {
    if (this.points) {
      this.scene.remove(this.points);
      this.scene.remove(this.lines);
      this.points.geometry.dispose();
      this.lines.geometry.dispose();
      this.material.dispose();
    }
  }
}
