import * as THREE from "three";

export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

export function renderCamera() {
  camera.position.set(0, 7, 15);
  camera.rotation.x = 5.6;
}
