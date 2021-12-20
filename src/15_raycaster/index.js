import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { Object3D } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('#webgl')

// Scene
const scene = new THREE.Scene()

const raycaster = new THREE.Raycaster()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

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

/* 
  Mouse
*/
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1
  mouse.y = -(e.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', () => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case object1:
        console.log('object1')
        break
      case object2:
        console.log('object2')
        break
      case object3:
        console.log('object3')
        break
    }
  }
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

let currentIntersect = null

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Animate Object
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

  raycaster.setFromCamera(mouse, camera)

  // Cast a ray
  // const rayOrigin=new THREE.Vector3(-3,0,0)
  // const rayDirection=new THREE.Vector3(10,0,0)
  // rayDirection.normalize() // normalize 方法将向量角度保存 但是长度变为1
  // raycaster.set(rayOrigin,rayDirection)

  const objectToTest = [object1, object2, object3]
  const intersects = raycaster.intersectObjects(objectToTest)

  for (const intersect of objectToTest) {
    intersect.material.color.set('#ff0000')
  }
  for (const intersect of intersects) {
    intersect.object.material.color.set('#0000ff')
  }
  if (intersects.length) {
    if (currentIntersect === null) {
      console.log('mouse enter')
    }
    currentIntersect = intersects[0]
  } else {
    if (currentIntersect) {
      console.log('mouse leaf')
    }
    currentIntersect = null
  }
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
