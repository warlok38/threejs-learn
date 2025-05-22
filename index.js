import * as THREE from "three";

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

const pointLight = new THREE.PointLight("#fff", 10, 100);
pointLight.position.set(0.5, 1, 1);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(pointLightHelper);

const spotLight = new THREE.SpotLight("#fff", 1);
spotLight.position.set(1, 1, 1);
scene.add(spotLight);

//render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//figures on scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: "red" });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0);

scene.add(cube);

//animation function
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
