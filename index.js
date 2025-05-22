import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.x = 15;
camera.position.y = 10;
camera.position.z = 50;

// light
const ambientLight = new THREE.AmbientLight("#fff", 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#fff", 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

//render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2;
controls.maxDistance = 30;

//figures on scene
const geometry = new THREE.BoxGeometry();
const originMaterial = new THREE.MeshStandardMaterial({ color: "red" });
const hightlightMaterial = new THREE.MeshStandardMaterial({
  color: "white",
  emissiveIntensity: 0.5,
});
const cube = new THREE.Mesh(geometry, originMaterial);
cube.position.set(0, 0, 0);

// scene.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshStandardMaterial({ color: "green" })
);

sphere.position.x = 2;
// scene.add(sphere);

// load models

const loader = new GLTFLoader();
loader.load(
  "models/car/scene.gltf",
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.05, 0.05, 0.05);
    model.position.set(0, 0, 0);

    scene.add(model);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.error("Error: " + error);
  }
);

//GSAP

// gsap.to(cube.position, {
//   y: 2,
//   x: 1,
//   duration: 1,
//   ease: "power1.inOut",
//   repeat: -1,
//   yoyo: true,
// });

//

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("mousemove", onMouseMove);

let isHover = false;

//animation function
function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(cube);

  if (intersects.length > 0 && !isHover) {
    cube.material = hightlightMaterial;
    isHover = true;

    gsap.to(cube.scale, { x: 1.5, y: 1.5, duration: 1.5, ease: "power1.out" });
  } else if (intersects.length === 0 && isHover) {
    cube.material = originMaterial;
    isHover = false;

    gsap.to(cube.scale, { x: 1, y: 1, duration: 1, ease: "power1.out" });
  }

  controls.update();
  renderer.setClearColor("lightBlue");
  renderer.render(scene, camera);
}

animate();
