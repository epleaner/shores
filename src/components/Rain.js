import * as THREE from 'three'
import Config from '../core/Config.js'

export default class Rain {
    constructor(scene) {
        this.scene = scene
        
        // Create the rain drop trail
        const points = []
        points.push(new THREE.Vector3(0, 0, 0))
        points.push(new THREE.Vector3(0, 0, -Config.rain.trailLength))
        
        const dropGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const dropMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
        })
        this.mesh = new THREE.Line(dropGeometry, dropMaterial)
        
        // Create light with random intensity
        const randomIntensity = THREE.MathUtils.randFloat(
            Config.rain.lightIntensity.min,
            Config.rain.lightIntensity.max
        )
        this.light = new THREE.PointLight(
            0xffffff, 
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
        // Random angle around the sky dome, but only in the upper hemisphere
        const theta = Math.random() * Math.PI * 2 // Full 360 degrees around
        const phi = Math.random() * Math.PI * 0.3 + Math.PI * 0.2
        const radius = Config.rain.radius

        // Convert spherical to cartesian coordinates
        const x = radius * Math.cos(phi) * Math.cos(theta)
        const z = radius * Math.cos(phi) * Math.sin(theta)
        const y = radius * Math.sin(phi)

        this.mesh.position.set(x, y, z)
        this.light.position.copy(this.mesh.position)
    }

    initializeVelocity() {
        // More diagonal trajectory
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            -Math.random() - 0.5,
            (Math.random() - 0.5) * 2
        ).normalize().multiplyScalar(Config.rain.speed)

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