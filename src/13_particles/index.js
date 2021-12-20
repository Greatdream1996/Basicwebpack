import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('#webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const startTexture= textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */

// Geometry
const particlesGemoetry=new THREE.BufferGeometry()
const count=20000

const postions=new Float32Array(count*3)
const colors=new Float32Array(count*3)

for (let i = 0; i < count * 3; i++) {
  postions[i]=(Math.random()-0.5) *10
  colors[i]=Math.random()
}

particlesGemoetry.setAttribute(
  'position',
  new THREE.BufferAttribute(postions,3)
)
particlesGemoetry.setAttribute(
  'color',
  new THREE.BufferAttribute(colors,3)
)
// Material
const particlesMaterial=new THREE.PointsMaterial({
  size:0.1,
  sizeAttenuation:true
})
// particlesMaterial.color=new THREE.Color('#ff88cc')
particlesMaterial.transparent=true
particlesMaterial.alphaMap=startTexture
// particlesMaterial.alphaTest=0.001
// particlesMaterial.depthTest=false
particlesMaterial.depthWrite=false
particlesMaterial.blending=THREE.AdditiveBlending
particlesMaterial.vertexColors=true
// Points
const particles=new THREE.Points(particlesGemoetry,particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
        const i3=i*3
        const x=particlesGemoetry.attributes.position.array[i3]
        particlesGemoetry.attributes.position.array[i3+1]=Math.sin(elapsedTime+x)
      
    }
    particlesGemoetry.attributes.position.needsUpdate=true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()