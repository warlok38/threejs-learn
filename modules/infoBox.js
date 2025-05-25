import * as THREE from "three";
import { CAR_POSITION_X } from "../consts";

const infoPoints = [
  {
    id: 1,
    position: new THREE.Vector3(CAR_POSITION_X, 0, 0),
    message:
      "Hello! This is my first test project on three.js\nPress buttons for action: up/down and space",
  },
  {
    id: 2,
    position: new THREE.Vector3(0, 0, CAR_POSITION_X),
    message:
      "Usually i use react, redux, js, ts, etc.\nBut here i trying something new",
  },
  {
    id: 3,
    position: new THREE.Vector3(-CAR_POSITION_X, 0, 0),
    message:
      "If u like this demo, please give this repo a star. (I really interested, will be at least one star?)",
  },
];

const infoBox = document.getElementById("info-block");
const POINT_POSITION_RADIUS = 2;

export function renderInfoBoxByScene(scene) {
  function createInfoSphere(spherePosition) {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      new THREE.MeshStandardMaterial({ color: "red" })
    );

    sphere.position.copy(spherePosition);
    sphere.position.y = -1;
    scene.add(sphere);
  }

  infoPoints.forEach((point) => {
    createInfoSphere(point.position);
  });
}

function showInfo(message) {
  infoBox.innerText = message;
  infoBox.style.opacity = 1;
}

function hideInfo() {
  infoBox.style.opacity = 0;
}

export function checkInfoPoints(model) {
  if (!model) {
    hideInfo();
    return;
  }

  let shouldShowInfo = false;
  let messageToShow = "";

  infoPoints.forEach((point) => {
    const distance = model.position.distanceTo(point.position);

    if (distance < POINT_POSITION_RADIUS) {
      shouldShowInfo = true;
      messageToShow = point.message;
    }
  });

  if (shouldShowInfo) {
    showInfo(messageToShow);
  } else {
    hideInfo();
  }
}
