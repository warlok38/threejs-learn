import * as THREE from "three";

export const ambientLight = new THREE.AmbientLight("#fff", 0.5);

export const directionalLight = new THREE.DirectionalLight("#ffd4bb", 1.2);
directionalLight.position.set(-1, 20, 3);

export const spotLight = new THREE.PointLight("#ffffe6", 150);
spotLight.position.set(-15, 15, 15);
// spotLight.position.set(-2, 6, 5);
spotLight.castShadow = true;
spotLight.shadow.intensity = 3;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
