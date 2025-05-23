import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//TODO animations not working from here
export function getCar(scene, car, mixer, jumpAction) {
  const loader = new GLTFLoader();

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
}
