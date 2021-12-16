import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

// debug
const gui = new dat.GUI()

// document
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const canvas = document.querySelector('#webgl')

// textrues

const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader=new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAmbientOcclusion = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeight = textureLoader.load('./textures/door/height.jpg')
const doorNormal = textureLoader.load('./textures/door/normal.jpg')
const doormetalness = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughness = textureLoader.load('./textures/door/roughness.jpg')
const doorAlpha = textureLoader.load('./textures/door/alpha.jpg')
const mathCapTextures = textureLoader.load('./textures/matcaps/1.png')
const gradients = textureLoader.load('./textures/gradients/3.jpg')
gradients.minFilter = THREE.NearestFilter
gradients.magFilter = THREE.NearestFilter
gradients.generateMipmaps = false

const environmentMapTexture=cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg'
])

// scene
const scene = new THREE.Scene()

/**
 * Object
 */
// const material = new THREE.MeshBasicMaterial()
// material.map=doorColorTexture
// material.color=new THREE.Color(0xff00ff)
// material.wireframe=true
// material.transparent = true // use opacity or alpha ? must open transparent attribute
// material.opacity = 0.5
// material.alphaMap = doorAlpha
// material.side= THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial()
// material.flatShading=true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = mathCapTextures

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess=100
// material.specular=new THREE.Color(0xff00ff)

// const material =new THREE.MeshToonMaterial()
// material.gradientMap=gradients

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0
// material.roughness = 1
// // map是材质得基本题图
// material.map = doorColorTexture
// // aoMap 第二层贴图 通常用来加深内部阴影
// material.aoMap = doorAmbientOcclusion
// material.aoMapIntensity=1
// // displacementMap 控制贴图得区域高度
// material.displacementMap=doorHeight
// material.displacementScale=0.05
// // metalnessMap 控制贴图得粗糙显示范围
// material.metalnessMap=doormetalness
// // roughnessMap 控制贴图反光得范围
// material.roughnessMap=doorRoughness
// // normalMap 控制贴图得真实细腻程度
// material.normalMap=doorNormal
// material.normalScale.set(0.5,0.5)
// // alphaMap 控制显示区域 只显示白色部分 黑色不显示
// material.transparent=true
// material.alphaMap=doorAlpha

const material= new THREE.MeshStandardMaterial()
material.metalness=0.7
material.roughness=0.2
material.envMap=environmentMapTexture

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material,'displacementScale').min(0).max(1).step(0.0001)
gui.add(material,'wireframe')

// const material = new THREE.MeshBasicMaterial({ map:textureLoader })

const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 16, 16), material)
sphere.position.x = -1.5

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1,100,100), material)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))


const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32), material)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

/**
 * lignt
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 2
pointLight.position.z = 4
scene.add(pointLight)

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
// fullscreen
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (!fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
camera.position.z = 3
// camera.position.x = 2
// camera.position.y = 2
scene.add(camera)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// camera.lookAt(new THREE.Vector3(3,0,0))

// render
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()
// Animations
const tick = () => {
  // Clock
  const elaspedTime = clock.getElapsedTime()
  // update objects
  sphere.rotation.y = elaspedTime * 0.1
  plane.rotation.y = elaspedTime * 0.1
  torus.rotation.y = elaspedTime * 0.1

  sphere.rotation.x = elaspedTime * 0.15
  plane.rotation.x = elaspedTime * 0.15
  torus.rotation.x = elaspedTime * 0.15

  // update controls
  controls.update()

  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
