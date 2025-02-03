import Camera from './Camera'
import Renderer from './Renderer'
import MainScene from '../scenes/MainScene'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

export default class Experience {
    constructor(canvas) {
        if (Experience.instance) {
            return Experience.instance
        }
        Experience.instance = this

        this.canvas = canvas
        this.camera = new Camera()
        this.renderer = new Renderer(this.canvas)
        this.scene = new MainScene()
        
        // Setup controls
        this.controls = new PointerLockControls(this.camera.camera, document.body)
        
        // Setup movement
        this.moveForward = false
        this.moveBackward = false
        this.moveLeft = false
        this.moveRight = false
        this.moveSpeed = 0.1

        this.setupControls()
        this.animate()
    }

    setupControls() {
        // Click to start
        document.addEventListener('click', () => {
            this.controls.lock()
        })

        // Movement keys
        document.addEventListener('keydown', (event) => {
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
        })

        document.addEventListener('keyup', (event) => {
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
        })
    }

    updateMovement() {
        if (this.controls.isLocked) {
            if (this.moveForward) this.controls.moveForward(this.moveSpeed)
            if (this.moveBackward) this.controls.moveForward(-this.moveSpeed)
            if (this.moveLeft) this.controls.moveRight(-this.moveSpeed)
            if (this.moveRight) this.controls.moveRight(this.moveSpeed)
        }
    }

    animate() {
        this.scene.update()
        this.updateMovement()
        this.renderer.renderer.render(this.scene.scene, this.camera.camera)
        requestAnimationFrame(() => this.animate())
    }
} 