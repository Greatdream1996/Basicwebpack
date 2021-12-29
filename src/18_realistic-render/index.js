import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('#webgl')

// Scene
const scene = new THREE.Scene()

/* Update all material */

const updateAllMaterial = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.material.needsUpdate=true
      child.castShadow=true
      child.receiveShadow=true
    }
  })
}

//Loaders
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/* EnvironmentMaps
 */
const environmentMap = cubeTextureLoader.load([
  'textures/environmentMaps/1/px.jpg',
  'textures/environmentMaps/1/nx.jpg',
  'textures/environmentMaps/1/py.jpg',
  'textures/environmentMaps/1/ny.jpg',
  'textures/environmentMaps/1/pz.jpg',
  'textures/environmentMaps/1/nz.jpg'
])
debugObject.envMapIntensity = 5
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environmentMap = environmentMap
gui
  .add(debugObject, 'envMapIntensity')
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(() => {
    updateAllMaterial()
  })
/*
    Moles 
 */
gltfLoader.load('models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(10, 10, 10)
  gltf.scene.position.set(0, -4, 0)
  gltf.scene.rotation.y = Math.PI * 0.5
  scene.add(gltf.scene)

  gui
    .add(gltf.scene.rotation, 'y')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name('rotation')
  updateAllMaterial()
})

/**
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//   new THREE.SphereBufferGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)

// Light
const directionLight = new THREE.DirectionalLight('#ffffff', 3)
directionLight.position.set(0.25, 3, -2.25)
directionLight.shadow.camera.far=15
directionLight.shadow.mapSize.set(1024,1024)
directionLight.castShadow=true

scene.add(directionLight)

const directionLightCameraHelper=new THREE.CameraHelper(directionLight.shadow.camera)
scene.add(directionLightCameraHelper)
gui
  .add(directionLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.001)
  .name('lightIntesity')
gui.add(directionLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(directionLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(directionLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(4, 1, -4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure=3
renderer.shadowMap.enabled=true
renderer.shadowMap.type=THREE.PCFSoftShadowMap

gui
  .add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterial()
  })
gui.add(renderer,'toneMappingExposure').min(0).max(10).step(0.001)
/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
