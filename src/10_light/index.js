import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

const gui = new dat.GUI()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// document
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

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

/**
 * lignt
 * 光效性能按照从低到高排列
 */
// 环境光 光线环绕射出
const ambientLight=new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)

// 环境光 将物质放置两种光之间
const hemispherLight=new THREE.HemisphereLight(0xff0000,0x0000ff,1)
scene.add(hemispherLight)

// 定向光 光线平行射出
const directionalLight=new THREE.DirectionalLight(0x00ffcc,0.3)
directionalLight.position.set(1,0.25,0)
scene.add(directionalLight)

// 光源点 不设置远近效果则光强度照射不同距离得物体相同 第三个参数为光强度范围
const pointLight=new THREE.PointLight(0xff9000,0.5,5)
pointLight.position.z=1
pointLight.position.x=1
gui.add(pointLight.position,'y').min(-10).max(10).step(0.01).name('pointLight-Y')
scene.add(pointLight)

// 补光灯 柔性灯光 带范围得灯光
const reactAreaLight=new THREE.RectAreaLight(0x4e00ff,5,3,1)
reactAreaLight.position.x=-1
reactAreaLight.position.z=-1
reactAreaLight.lookAt(new THREE.Vector3(0,1,0))
scene.add(reactAreaLight)

// 聚光灯 聚光灯看向得是对象，移动聚光灯需要移动对象的位置
const spotLight=new THREE.SpotLight(0x78ff00,0.5,7,Math.PI*0.1,0.25,1)
spotLight.position.set(1,2,3)
scene.add(spotLight.target)
scene.add(spotLight)

/**
 * light helper
 */
const hemispherLightHelper=new THREE.HemisphereLightHelper(hemispherLight,0.2)
scene.add(hemispherLightHelper)

const directionalLightHelper=new THREE.DirectionalLightHelper(directionalLight,0.2)
scene.add(directionalLightHelper)

const pointLightHelper=new THREE.PointLightHelper(pointLight,0.2)
scene.add(pointLightHelper)

const spotLightHelper=new THREE.SpotLightHelper(spotLight,0.2)
scene.add(spotLightHelper)

window.requestAnimationFrame(()=>{
  spotLightHelper.update()
})

const rectAreaLightHelper=new RectAreaLightHelper(reactAreaLight)
scene.add(rectAreaLightHelper)

window.requestAnimationFrame(()=>{
  rectAreaLightHelper.position.copy(reactAreaLight.position)
  rectAreaLightHelper.update()
})
// geometry
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material)
sphere.position.x = -1.5

const box = new THREE.Mesh(new THREE.BoxBufferGeometry(0.75, 0.75, 0.75), material)

const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64), material)
torus.position.x = 1.5

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material)
plane.position.y = -0.65
plane.rotation.x = -Math.PI * 0.5
gui.add(plane.rotation, 'x', -3.14, 3.14, 0.01)

scene.add(sphere, box, torus, plane)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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
  box.rotation.y = elaspedTime * 0.1
  torus.rotation.y = elaspedTime * 0.1

  sphere.rotation.x = elaspedTime * 0.15
  box.rotation.x = elaspedTime * 0.15
  torus.rotation.x = elaspedTime * 0.15

  // update controls
  controls.update()

  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
