import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const gui = new dat.GUI()
// basic
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const canvas = document.querySelector('#webgl')
window.addEventListener('resize', () => {
  // update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// scene
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const simpleShadow = textureLoader.load('/textures/shadow/simpleShadow.jpg')
//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// geometry
const material = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material)
sphere.castShadow = true

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material)
plane.receiveShadow = true
plane.position.y = -0.65
plane.rotation.x = -Math.PI * 0.5

const planeA = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 1.5), 
  new THREE.MeshBasicMaterial({ 
    color: 0xff00ff,
    transparent:true,
    alphaMap:simpleShadow
  }))
planeA.rotation.x = -Math.PI * 0.5
planeA.position.y = plane.position.y + 0.01
scene.add(sphere, plane, planeA)

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambientLight-intensity')
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
directionalLight.position.set(2, 2, -1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('directionalLight-intensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)

directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.radius = 10

const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionLightCameraHelper.visible = false
scene.add(directionLightCameraHelper)

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)
scene.add(spotLight)

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

const spotLightCameraHelp = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelp.visible = false
scene.add(spotLightCameraHelp)

// point Light
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

pointLight.position.set(-1, 1, 0)
scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

// render
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap
const clock = new THREE.Clock()
// Animations
const tick = () => {
  // Clock
  const elaspedTime = clock.getElapsedTime()
  // update objects
  sphere.position.x=Math.cos(elaspedTime*1.5)
  sphere.position.z=Math.sin(elaspedTime*1.5)
  sphere.position.y=Math.abs(Math.sin(elaspedTime*3))

  planeA.position.x=sphere.position.x
  planeA.position.z=sphere.position.z
  planeA.material.opacity=(1-sphere.position.y )*0.3

  // update controls
  controls.update()

  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
