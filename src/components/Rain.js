import * as THREE from 'three'
import Config from '../core/Config.js'

export default class Rain {
    constructor(scene, camera) {
        this.scene = scene
        this.camera = camera
        
        // Create the raindrop trail pointing downward
        const points = []
        points.push(new THREE.Vector3(0, 0, 0))
        points.push(new THREE.Vector3(0, -Config.rain.trailLength, 0)) // Trail points down
        
        const dropGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const dropMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        })
        this.mesh = new THREE.Line(dropGeometry, dropMaterial)
        
        // Rotate the mesh 180 degrees so the trail follows the drop
        this.mesh.rotation.x = Math.PI
        
        // Subtle light
        const randomIntensity = THREE.MathUtils.randFloat(
            Config.rain.lightIntensity.min,
            Config.rain.lightIntensity.max
        )
        this.light = new THREE.PointLight(
            0xffffff,  // Changed to white
            randomIntensity,
            Config.rain.lightRange
        )
        
        // Initialize properties
        this.life = 1.0
        this.fadeSpeed = THREE.MathUtils.randFloat(
            Config.rain.fadeSpeed.min,
            Config.rain.fadeSpeed.max
        )
        this.maxIntensity = randomIntensity
        
        this.initializePosition()
        this.initializeVelocity()
        
        // Add to scene
        this.scene.add(this.mesh)
        this.scene.add(this.light)
    }

    initializePosition() {
        // Get a position in a box above the player, but maintain world-space up direction
        const cameraPos = this.camera.position
        
        // Calculate spawn box dimensions
        const spread = Config.rain.spread
        const height = Config.rain.height
        
        // Random position in world space, centered on player's xz position
        const x = cameraPos.x + (Math.random() - 0.5) * spread.x
        const y = cameraPos.y + height // Always spawn above player
        const z = cameraPos.z + (Math.random() - 0.5) * spread.z

        this.mesh.position.set(x, y, z)
        this.light.position.copy(this.mesh.position)
    }

    initializeVelocity() {
        // Always fall straight down in world space
        this.velocity = new THREE.Vector3(
            0,                      // No horizontal movement
            -Config.rain.speed,     // Straight down
            0                       // No horizontal movement
        )

        // No need to orient the trail since it's already pointing in the right direction
    }

    update() {
        // Update position
        this.mesh.position.add(this.velocity)
        this.light.position.copy(this.mesh.position)

        // Update life and opacity
        this.life -= this.fadeSpeed
        this.mesh.material.opacity = this.life * 0.3
        this.light.intensity = this.life * this.maxIntensity

        // Remove if too low or faded out
        const minY = this.camera.position.y - Config.rain.height // Remove when below player
        return this.life > 0 && this.mesh.position.y > minY
    }

    dispose() {
        this.scene.remove(this.mesh)
        this.scene.remove(this.light)
        this.mesh.geometry.dispose()
        this.mesh.material.dispose()
    }
} 