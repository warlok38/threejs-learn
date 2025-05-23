import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  ambientLight,
  checkInfoPoints,
  directionalLight,
  getGrass,
  getIsland,
  getRoad,
  renderInfoBoxByScene,
  spotLight,
} from "./modules";
import { CAR_POSITION_X } from "./consts";
import { renderCamera, camera } from "./modules/camera";

//scene
const scene = new THREE.Scene();

//camera
renderCamera();

//render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// light
scene.add(ambientLight);
scene.add(directionalLight);
scene.add(spotLight);

const pointLightHelper = new THREE.PointLightHelper(spotLight, 1);
scene.add(pointLightHelper);

const loaderTexture = new THREE.TextureLoader();

// loaders
//Load background texture

loaderTexture.load("images/background.jpg", function (texture) {
  scene.background = texture;
  scene.backgroundIntensity = 0.7;
});

const loader = new GLTFLoader();
let car;
let mixer;
let jumpAction;

loader.load(
  "models/car/scene.gltf",
  (gltf) => {
    car = gltf.scene;
    car.scale.set(1.5, 1.5, 1.5);
    car.position.set(CAR_POSITION_X, 0, 0);

    //init animation
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(car);
      jumpAction = mixer.clipAction(gltf.animations[0]);
      jumpAction.setLoop(THREE.LoopOnce);
      jumpAction.setDuration(1);
    }

    car.traverse(function (node) {
      if (node.type === "Mesh") {
        node.castShadow = true;
      }
    });

    scene.add(car);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.error("Error: " + error);
  }
);

let angle = 0;
let isMovingForward = false;
let isMovingBack = false;
let isJumping = false;
let clock = new THREE.Clock();
let jumpTime = 0;
let jumpDuration = 1;
let maxJumpHeight = 5;

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    isMovingForward = true;
  }

  if (event.key === "ArrowDown") {
    isMovingBack = true;
  }

  if (event.code === "Space" && !isJumping && car) {
    isJumping = true;

    if (jumpAction) {
      jumpAction.reset().play();
    }
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    isMovingForward = false;
  }

  if (event.key === "ArrowDown") {
    isMovingBack = false;
  }
});

function moveCarForward() {
  if (!car || !isMovingForward) {
    return;
  }

  angle += 0.01;
  car.position.x = CAR_POSITION_X * Math.cos(angle);
  car.position.z = CAR_POSITION_X * Math.sin(angle);
  car.rotation.y = -angle;
}

function moveCarBack() {
  if (!car || !isMovingBack) {
    return;
  }

  angle -= 0.01;
  car.position.x = CAR_POSITION_X * Math.cos(angle);
  car.position.z = CAR_POSITION_X * Math.sin(angle);
  car.rotation.y = -angle;
}

function handleJump(delta) {
  if (!isJumping || !car) return;

  jumpTime += delta;
  const progress = Math.min(jumpTime / jumpDuration, 1);

  const jumpHeight = Math.sin(progress * Math.PI) * maxJumpHeight;
  car.position.y = jumpHeight;

  // end jump phase
  if (progress >= 1) {
    car.position.y = 0;
    isJumping = false;
    jumpTime = 0;
  }
}

scene.add(getRoad());
renderInfoBoxByScene(scene);
getIsland(scene);
getGrass(scene);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 50;

//animation function
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (mixer) {
    mixer.update(delta);
  }

  handleJump(delta);
  moveCarForward();
  moveCarBack();
  checkInfoPoints(car);

  renderer.render(scene, camera);
}

animate();
