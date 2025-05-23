import * as THREE from "three";
import { bendTexture } from "../utils/bendTexure";

export function getRoad() {
  let roadRingParams = {
    innerRadius: 3.7,
    outerRadius: 6.7,
    thetaSegments: 100,
    repeat: 2.6,
  };

  const loaderTexture = new THREE.TextureLoader();
  const roadGeometry = new THREE.PlaneGeometry(
    roadRingParams.innerRadius,
    roadRingParams.outerRadius,
    roadRingParams.thetaSegments
  );

  bendTexture(
    roadGeometry,
    roadRingParams.innerRadius,
    roadRingParams.outerRadius
  );

  const roadTexture = loaderTexture.load("images/road.jpg", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(roadRingParams.repeat, 1);
  });

  roadTexture.colorSpace = THREE.SRGBColorSpace;

  const roadMaterial = new THREE.MeshStandardMaterial({
    map: roadTexture,
  });

  const road = new THREE.Mesh(roadGeometry, roadMaterial);

  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.01;
  road.receiveShadow = true;

  return road;
}
