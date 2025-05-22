import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 5, 15);
camera.rotation.x = 6;

//render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// light
const ambientLight = new THREE.AmbientLight("#fff", 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#fff", 0.5);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

//shapes
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 20),
  new THREE.MeshStandardMaterial({ color: "#333" })
);
road.rotation.x = -Math.PI / 2;
scene.add(road);

// loader
const loader = new GLTFLoader();
let car;
let mixer;
let jumpAction;

loader.load(
  "models/car/scene.gltf",
  (gltf) => {
    car = gltf.scene;
    car.scale.set(2, 2, 2);
    car.position.set(0, 0, 0);

    //init animation
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(car);
      jumpAction = mixer.clipAction(gltf.animations[0]);
      jumpAction.setLoop(THREE.LoopOnce);
      jumpAction.setDuration(1);
    }

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
    jumpHeight = 0;

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
  car.position.x = 5 * Math.cos(angle);
  car.position.z = 5 * Math.sin(angle);
  car.rotation.y = -angle;
}

function moveCarBack() {
  if (!car || !isMovingBack) {
    return;
  }

  angle -= 0.01;
  car.position.x = 5 * Math.cos(angle);
  car.position.z = 5 * Math.sin(angle);
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

//points
const infoPoints = [
  {
    position: new THREE.Vector3(5, 0, 0),
    message: "about me: im a web developer!",
  },
  {
    position: new THREE.Vector3(-5, 0, 0),
    message: "skills: javascript, typescript, three.js",
  },
  {
    position: new THREE.Vector3(0, 0, 5),
    message: "contacts: warlok38@mail.ru",
  },
];

function createInfoSphere(position) {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    new THREE.MeshStandardMaterial({ color: "red" })
  );

  sphere.position.copy(position);
  sphere.position.y = 2;
  scene.add(sphere);
}

infoPoints.forEach((point) => {
  createInfoSphere(point.position);
});

function showInfo(message) {
  const infoBox = document.getElementById("info-block");
  infoBox.innerText = message;
  infoBox.style.display = "block";
}

function checkInfoPoints() {
  infoPoints.forEach((point) => {
    const distance = car?.position.distanceTo(point.position);

    if (distance < 0.5) {
      showInfo(point.message);
    }
  });
}

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
  checkInfoPoints();

  renderer.setClearColor("lightblue");
  renderer.render(scene, camera);
}

animate();
