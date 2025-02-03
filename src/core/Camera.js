import * as THREE from 'three'
import Config from './Config.js'

export default class Camera {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        
        // Start slightly above the surface
        this.camera.position.set(0, 5, 20) // Moved back to see more
        this.camera.lookAt(0, 0, 0)
        this.camera.up.set(0, 1, 0)

        // Handle resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
        })
    }
} 