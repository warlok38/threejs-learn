import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getRandomNumber } from "./utils/getRandomNumber";

const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 5;

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
controls.maxDistance = 10;

//figures on scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: "red" });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0);

scene.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshStandardMaterial({ color: "green" })
);

sphere.position.x = 2;
scene.add(sphere);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const colors = ["orange", "blue", "pink", "yellow"];

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  console.log(getRandomNumber(0, colors.length - 1));
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(
      colors[getRandomNumber(0, colors.length - 1)]
    );
  }
}

window.addEventListener("click", onMouseClick);

//animation function
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

animate();
