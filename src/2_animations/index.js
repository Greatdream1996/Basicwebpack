import * as THREE from 'three'
import gsap from 'gsap'

// document
const canvas = document.querySelector('#webgl')

// scene
const scene = new THREE.Scene()

// mesh
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const sizes = {
  width: 800,
  height: 600
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// camera.lookAt(new THREE.Vector3(3,0,0))
camera.lookAt(mesh.position)

// render
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 })
// Animations
const tick = () => {
  // Clock
  const elaspedTime = clock.getElapsedTime()

  // update objects
  // mesh.rotation.y=elaspedTime
  // mesh.position.y = Math.sin(elaspedTime)

  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
