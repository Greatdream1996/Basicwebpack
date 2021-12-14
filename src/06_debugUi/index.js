import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

// Debug
const gui = new dat.GUI()
const parameters={
  color:0xffff00,
  spin:()=>{
    gsap.to(mesh.rotation,{duration:1,y:mesh.rotation.y+10})
  }
}
gui.addColor(parameters,'color').onChange(()=>{
  material.color.set(parameters.color)
})
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
const material = new THREE.MeshBasicMaterial({ color: parameters.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Debug
gui.add(mesh.position, 'y', -3, 3, 0.01)
// gui.add(mesh.position, 'x', -3, 3, 0.01)
gui.add(mesh.position,'x').min(-3).max(3).step(0.01).name('xxx')
gui.add(mesh.position, 'z', -3, 3, 0.01)

gui.add(parameters,'spin')

gui.add(mesh,'visible')

gui.add(mesh.material,'wireframe')

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
camera.position.z = 2
camera.position.x = 2
camera.position.y = 2
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
