import * as THREE from 'three'
import Config from '../core/Config.js'

export default class ShootingStar {
    constructor(scene) {
        this.scene = scene
        
        // Create the shooting star trail
        const points = []
        points.push(new THREE.Vector3(0, 0, 0))
        points.push(new THREE.Vector3(0, 0, -Config.shootingStars.trailLength))
        
        const starGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const starMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
        })
        this.mesh = new THREE.Line(starGeometry, starMaterial)
        
        // Create light with random intensity
        const randomIntensity = THREE.MathUtils.randFloat(
            Config.shootingStars.lightIntensity.min,
            Config.shootingStars.lightIntensity.max
        )
        this.light = new THREE.PointLight(
            0xffffff, 
            randomIntensity,
            Config.shootingStars.lightRange
        )
        
        // Initialize properties
        this.life = 1.0
        this.fadeSpeed = THREE.MathUtils.randFloat(
            Config.shootingStars.fadeSpeed.min,
            Config.shootingStars.fadeSpeed.max
        )
        this.maxIntensity = randomIntensity
        
        this.initializePosition()
        this.initializeVelocity()
        
        // Add to scene
        this.scene.add(this.mesh)
        this.scene.add(this.light)
    }

    initializePosition() {
        const radius = Config.shootingStars.radius
        
        // Random angle in the sky dome
        const theta = Math.random() * Math.PI * 2 // Full circle
        const phi = Math.random() * Math.PI * 0.3 + Math.PI * 0.2 // Upper portion of sky

        // Convert to cartesian coordinates
        const x = radius * Math.cos(phi) * Math.cos(theta)
        const y = radius * Math.sin(phi)
        const z = radius * Math.cos(phi) * Math.sin(theta)

        this.mesh.position.set(x, y, z)
        this.light.position.copy(this.mesh.position)
    }

    initializeVelocity() {
        // Calculate a tangent vector to create motion perpendicular to the radius
        const position = this.mesh.position.clone().normalize()
        const up = new THREE.Vector3(0, 1, 0)
        
        // Create a vector perpendicular to both the position and up vector
        const tangent = new THREE.Vector3()
        tangent.crossVectors(position, up).normalize()
        
        // Add slight downward tilt and random variation
        const velocity = new THREE.Vector3()
        velocity.copy(tangent)
        velocity.y -= 0.1 // Slight downward tilt
        
        // Add some random variation
        velocity.x += (Math.random() - 0.5) * 0.2
        velocity.z += (Math.random() - 0.5) * 0.2
        
        // Randomize direction (left or right)
        if (Math.random() > 0.5) {
            velocity.multiplyScalar(-1)
        }

        this.velocity = velocity.normalize().multiplyScalar(Config.shootingStars.speed)

        // Orient the trail along the velocity
        this.mesh.lookAt(
            this.mesh.position.clone().add(this.velocity)
        )
    }

    update() {
        // Update position
        this.mesh.position.add(this.velocity)
        this.light.position.copy(this.mesh.position)

        // Update life and opacity
        this.life -= this.fadeSpeed
        this.mesh.material.opacity = this.life
        this.light.intensity = this.life * this.maxIntensity

        return this.life > 0
    }

    dispose() {
        this.scene.remove(this.mesh)
        this.scene.remove(this.light)
        this.mesh.geometry.dispose()
        this.mesh.material.dispose()
    }
} 