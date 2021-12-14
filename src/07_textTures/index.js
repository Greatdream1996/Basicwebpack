import * as THREE from 'three'
import { OrthographicCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import imageSource from './color.jpg'
import checkerboard from './checkerboard-8x8.png'

// texture
// const image = new Image()
// const texture=new THREE.Texture(image)
// image.onload=()=>{
//   console.lo
//   texture.needsUpdate= true
// }
// image.src=imageSource
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const texture = textureLoader.load(
  // imageSource,
  checkerboard,
  () => {
    console.log('load')
  },
  () => {
    console.log('progress')
  },
  () => {
    console.log('error')
  }
)
texture.generateMipmaps = false
// texture.minFilter=THREE.NearestFilter
texture.magFilter = THREE.NearestFilter
// document
const canvas = document.querySelector('#webgl')

const cursor = {
  x: 0,
  y: 0
}

window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = e.clientY / sizes.height - 0.5
})

// scene
const scene = new THREE.Scene()

// mesh
const geometry = new THREE.BoxGeometry(1, 1, 1)
console.log(geometry.attributes.uv)
const material = new THREE.MeshBasicMaterial({ map: texture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

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
camera.lookAt(mesh.position)
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
  // mesh.rotation.y = elaspedTime
  // mesh.position.y = Math.sin(elaspedTime)

  // update controls
  controls.update()

  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
