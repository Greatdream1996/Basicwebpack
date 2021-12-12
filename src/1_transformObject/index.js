console.log('three_01')
import * as THREE from 'three'

// document
const canvas = document.querySelector('#webgl')

// scene
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// mesh
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

mesh.position.set(0.7,-0.6,1)
// mesh.scale.set(1,0.5,0.5)
mesh.rotation.x=Math.PI*0.25

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
renderer.render(scene, camera)
