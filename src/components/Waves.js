import * as THREE from 'three';
import WavesMaterial from '../materials/shaders/waves/shaders';

export default class Waves {
  constructor(scene, radius = 100) {
    this.scene = scene;

    // Create a large plane for the waves
    const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2, 128, 128);
    geometry.rotateX(-Math.PI / 2); // Lay flat

    // Create material
    this.material = new WavesMaterial();

    // Create mesh
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.y = -0.2; // Slightly below the island

    // Add to scene
    this.scene.add(this.mesh);
  }

  update(time) {
    if (this.material) {
      this.material.update(time);
    }
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.mesh);
  }
}
