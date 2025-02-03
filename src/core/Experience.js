import Camera from './Camera'
import Renderer from './Renderer'
import MainScene from '../scenes/MainScene'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import * as THREE from 'three'
import Config from './Config.js'

export default class Experience {
    constructor(canvas) {
        if (Experience.instance) {
            return Experience.instance
        }
        Experience.instance = this

        this.canvas = canvas
        this.camera = new Camera()
        this.renderer = new Renderer(this.canvas)
        this.scene = new MainScene(this.renderer.renderer)
        
        // Setup controls
        this.controls = new PointerLockControls(this.camera.camera, document.body)
        
        // Add pitch limits
        this.minPolarAngle = 0
        this.maxPolarAngle = Math.PI * 0.75
        this.pitch = 0
        this.yaw = 0

        // Setup movement
        this.moveForward = false
        this.moveBackward = false
        this.moveLeft = false
        this.moveRight = false
        this.moveSpeed = Config.player.moveSpeed
        this.sphereRadius = Config.world.sphereRadius

        // Starting position
        this.position = new THREE.Vector3(0, 1.5, 20) // Start on the visible part of the sphere
        this.camera.camera.position.copy(this.position)

        this.setupControls()
        this.animate()
    }

    setupControls() {
        // Click to start
        document.addEventListener('click', () => {
            // Only lock if we're not in GUI mode
            if (!this.guiMode) {
                this.controls.lock()
            }
        })

        // Toggle between GUI and camera controls
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Backquote') { // ` key
                if (this.controls.isLocked) {
                    this.controls.unlock()
                    this.guiMode = true
                } else {
                    this.guiMode = false
                }
            }
        })

        // Listen for lock/unlock events
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === document.body) {
                this.guiMode = false
            } else if (!this.guiMode) {
                // Only reset if we're not explicitly in GUI mode
                this.moveForward = false
                this.moveBackward = false
                this.moveLeft = false
                this.moveRight = false
            }
        })

        // Custom mouse movement handler
        document.addEventListener('mousemove', (event) => {
            if (this.controls.isLocked) {
                const movementX = event.movementX || 0
                const movementY = event.movementY || 0
                
                // Update yaw (left/right)
                this.yaw -= movementX * 0.002

                // Update pitch (up/down) with limits
                this.pitch -= movementY * 0.002
                this.pitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.pitch))

                // Apply rotation
                const qx = new THREE.Quaternion()
                const qy = new THREE.Quaternion()
                qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw)
                qy.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch)
                
                this.camera.camera.quaternion.copy(qx).multiply(qy)
            }
        })

        // Movement keys
        document.addEventListener('keydown', (event) => {
            if (!this.guiMode) {
                switch (event.code) {
                    case 'ArrowUp':
                    case 'KeyW':
                        this.moveForward = true
                        break
                    case 'ArrowDown':
                    case 'KeyS':
                        this.moveBackward = true
                        break
                    case 'ArrowLeft':
                    case 'KeyA':
                        this.moveLeft = true
                        break
                    case 'ArrowRight':
                    case 'KeyD':
                        this.moveRight = true
                        break
                }
            }
        })

        document.addEventListener('keyup', (event) => {
            if (!this.guiMode) {
                switch (event.code) {
                    case 'ArrowUp':
                    case 'KeyW':
                        this.moveForward = false
                        break
                    case 'ArrowDown':
                    case 'KeyS':
                        this.moveBackward = false
                        break
                    case 'ArrowLeft':
                    case 'KeyA':
                        this.moveLeft = false
                        break
                    case 'ArrowRight':
                    case 'KeyD':
                        this.moveRight = false
                        break
                }
            }
        })
    }

    updateMovement() {
        if (this.controls.isLocked) {
            // Get camera's forward and right vectors (ignore Y component for walking)
            const forward = new THREE.Vector3(0, 0, -1)
            const right = new THREE.Vector3(1, 0, 0)
            forward.applyQuaternion(this.camera.camera.quaternion)
            right.applyQuaternion(this.camera.camera.quaternion)
            
            // Zero out Y component to keep movement horizontal relative to camera
            forward.y = 0
            right.y = 0
            forward.normalize()
            right.normalize()

            // Calculate movement direction
            const moveDirection = new THREE.Vector3(0, 0, 0)
            if (this.moveForward) moveDirection.add(forward)
            if (this.moveBackward) moveDirection.sub(forward)
            if (this.moveLeft) moveDirection.sub(right)
            if (this.moveRight) moveDirection.add(right)

            if (moveDirection.length() > 0) {
                moveDirection.normalize()
                
                // Calculate new position
                const newPosition = this.position.clone()
                newPosition.add(moveDirection.multiplyScalar(this.moveSpeed))

                // Project onto sphere surface
                const xz = Math.sqrt(newPosition.x * newPosition.x + newPosition.z * newPosition.z)
                const angle = Math.atan2(xz, this.sphereRadius)
                
                if (angle <= Config.world.visibleSectionAngle) {
                    // Calculate height on sphere
                    const height = this.sphereRadius * Math.cos(angle)
                    newPosition.y = -this.sphereRadius + height + Config.player.headHeight

                    // Update position
                    this.position.copy(newPosition)
                    this.camera.camera.position.copy(this.position)
                }
            }
        }
    }

    animate() {
        this.scene.update()
        this.updateMovement()
        this.renderer.renderer.render(this.scene.scene, this.camera.camera)
        requestAnimationFrame(() => this.animate())
    }
} 