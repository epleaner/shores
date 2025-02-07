import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaderSource.js';
import Config from '../../../core/Config.js';

export default class WavesMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uWaveSpeed: { value: Config.waves.speed },
        uWaveFrequency: { value: Config.waves.frequency },
        uWaterColor: { value: new THREE.Color(Config.waves.color) },
        uOpacity: { value: Config.waves.opacity },
        uThickness: { value: Config.waves.thickness },
        uNoiseStrength: { value: Config.waves.noiseStrength },
        uNoiseScale: { value: Config.waves.noiseScale },
        uNoiseSpeed: { value: Config.waves.noiseSpeed },
      },
    });
  }

  update(time) {
    this.uniforms.uTime.value = time;
  }

  updateUniforms() {
    this.uniforms.uWaveSpeed.value = Config.waves.speed;
    this.uniforms.uWaveFrequency.value = Config.waves.frequency;
    this.uniforms.uWaterColor.value.set(Config.waves.color);
    this.uniforms.uOpacity.value = Config.waves.opacity;
    this.uniforms.uThickness.value = Config.waves.thickness;
    this.uniforms.uNoiseStrength.value = Config.waves.noiseStrength;
    this.uniforms.uNoiseScale.value = Config.waves.noiseScale;
    this.uniforms.uNoiseSpeed.value = Config.waves.noiseSpeed;
  }
}
