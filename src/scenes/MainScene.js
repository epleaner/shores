import * as THREE from 'three'

export default class MainScene {
    constructor() {
        this.scene = new THREE.Scene()
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
        directionalLight.position.set(0, 10, 0)
        this.scene.add(directionalLight)
        
        // Add a ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20)
        const groundMaterial = new THREE.MeshStandardMaterial({ // Changed to StandardMaterial to work with lighting
            color: 0x808080,
            side: THREE.DoubleSide
        })
        const ground = new THREE.Mesh(groundGeometry, groundMaterial)
        ground.rotation.x = Math.PI / 2 // Make it horizontal
        ground.position.y = 0
        this.scene.add(ground)
    }

    update() {
        // Empty update method (will be called by Experience)
    }
} 