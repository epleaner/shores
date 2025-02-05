import * as dat from 'dat.gui';
import Config from './Config.js';

export default class GUI {
  constructor(scene) {
    this.scene = scene;
    this.gui = new dat.GUI();
    this.setupGUI();
  }

  setupGUI() {
    // Weather effects folder
    const effectsFolder = this.gui.addFolder('Weather Effects');
    const effects = {
      shootingStars: false,
      rain: true,
      waves: true,
    };
    effectsFolder.add(effects, 'shootingStars').onChange((value) => {
      this.scene.toggleShootingStars(value);
    });
    effectsFolder.add(effects, 'rain').onChange((value) => {
      this.scene.toggleRain(value);
    });
    effectsFolder.add(effects, 'waves').onChange((value) => {
      this.scene.toggleWaves(value);
    });
    effectsFolder.open();

    // Waves folder
    const wavesFolder = this.gui.addFolder('Waves');
    wavesFolder
      .add(Config.waves, 'speed', 0.1, 2)
      .name('Speed')
      .onChange(() => {
        this.scene.waves?.material.updateUniforms();
      });
    wavesFolder
      .add(Config.waves, 'frequency', 0.01, 0.5)
      .name('Frequency')
      .onChange(() => {
        this.scene.waves?.material.updateUniforms();
      });
    wavesFolder
      .add(Config.waves, 'amplitude', 0.1, 2)
      .name('Height')
      .onChange(() => {
        this.scene.waves?.material.updateUniforms();
      });
    wavesFolder
      .add(Config.waves, 'opacity', 0, 1)
      .name('Opacity')
      .onChange(() => {
        this.scene.waves?.material.updateUniforms();
      });
    wavesFolder
      .addColor(Config.waves, 'color')
      .name('Color')
      .onChange(() => {
        this.scene.waves?.material.updateUniforms();
      });
    wavesFolder.open();

    // Shooting stars folder
    const starsFolder = this.gui.addFolder('Shooting Stars');
    starsFolder
      .add(Config.shootingStars, 'spawnRate', 0, 0.2)
      .name('Spawn Rate');
    starsFolder.add(Config.shootingStars, 'radius', 100, 2000).name('Distance');
    starsFolder.add(Config.shootingStars, 'size', 0.1, 5).name('Size');
    starsFolder.add(Config.shootingStars, 'speed', 1, 20).name('Speed');
    starsFolder
      .add(Config.shootingStars, 'trailLength', 1, 50)
      .name('Trail Length');

    const starsLightFolder = starsFolder.addFolder('Light Settings');
    starsLightFolder
      .add(Config.shootingStars.lightIntensity, 'min', 0, 500)
      .name('Min Intensity');
    starsLightFolder
      .add(Config.shootingStars.lightIntensity, 'max', 0, 500)
      .name('Max Intensity');
    starsLightFolder
      .add(Config.shootingStars, 'lightRange', 100, 10000)
      .name('Light Range');

    const starsFadeFolder = starsFolder.addFolder('Fade Settings');
    starsFadeFolder
      .add(Config.shootingStars.fadeSpeed, 'min', 0.001, 0.05)
      .name('Min Fade Speed');
    starsFadeFolder
      .add(Config.shootingStars.fadeSpeed, 'max', 0.001, 0.05)
      .name('Max Fade Speed');

    starsFolder.open();

    // Rain folder
    const rainFolder = this.gui.addFolder('Rain');
    rainFolder.add(Config.rain, 'spawnRate', 0, 1).name('Spawn Rate');
    rainFolder.add(Config.rain, 'size', 0.1, 1).name('Size');
    rainFolder.add(Config.rain, 'speed', 1, 50).name('Speed');
    rainFolder.add(Config.rain, 'count', 100, 5000).step(100).name('Max Drops');

    const rainSpreadFolder = rainFolder.addFolder('Spread Settings');
    rainSpreadFolder.add(Config.rain.spread, 'x', 10, 200).name('Spread X');
    rainSpreadFolder.add(Config.rain.spread, 'z', 10, 200).name('Spread Z');
    rainSpreadFolder.add(Config.rain, 'height', 10, 200).name('Height');

    const rainLightFolder = rainFolder.addFolder('Light Settings');
    rainLightFolder
      .add(Config.rain.lightIntensity, 'min', 0, 1)
      .name('Min Intensity');
    rainLightFolder
      .add(Config.rain.lightIntensity, 'max', 0, 1)
      .name('Max Intensity');
    rainLightFolder.add(Config.rain, 'lightRange', 10, 200).name('Light Range');

    const rainFadeFolder = rainFolder.addFolder('Fade Settings');
    rainFadeFolder
      .add(Config.rain.fadeSpeed, 'min', 0.001, 0.05)
      .name('Min Fade Speed');
    rainFadeFolder
      .add(Config.rain.fadeSpeed, 'max', 0.001, 0.05)
      .name('Max Fade Speed');
  }
}
