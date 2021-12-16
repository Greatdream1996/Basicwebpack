import * as THREE from 'three'
import typefaceFront from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// FontLoader已经移动到外部了
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
// document
const canvas = document.querySelector('#webgl')

// scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// textrues
const textureLoader = new THREE.TextureLoader()
const matcapTexture= textureLoader.load('/textures/matcaps/8.png')

// fonts
const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Helllo Three.js', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4
  })
  textGeometry.computeBoundingBox()
  console.log(textGeometry.boundingBox)
  textGeometry.translate(
    -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  )

  const Marterial = new THREE.MeshMatcapMaterial({matcap:matcapTexture})
  // textMarterial.wireframe = true
  const text = new THREE.Mesh(textGeometry, Marterial)
  scene.add(text)

  console.time('dounts')
  const countGeometry=new THREE.TorusBufferGeometry(0.3,0.2,20,45)
  for (let i = 0; i < 100; i++) {
    const dount=new THREE.Mesh(countGeometry,Marterial)
    dount.position.x=(Math.random()-0.5)*10
    dount.position.y=(Math.random()-0.5)*10
    dount.position.z=(Math.random()-0.5)*10

    dount.rotation.x=Math.random()*Math.PI
    dount.rotation.y=Math.random()*Math.PI

    const scale=Math.random()
    dount.scale.set(scale,scale,scale)
    scene.add(dount)
  }
  console.timeEnd('dounts')
})

// mesh
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

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
