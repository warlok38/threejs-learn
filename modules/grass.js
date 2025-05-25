import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function getGrass(scene) {
  const loader = new GLTFLoader();

  loader.load(
    "models/grass/scene.gltf",
    (gltf) => {
      let model = gltf.scene;
      model.scale.set(0.7, 0.7, 0.7);
      model.position.set(1.5, 0, 0);

      model.traverse(function (node) {
        if (node.type === "Mesh") {
          node.castShadow = true;
        }
      });

      scene.add(model);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error("Error: " + error);
    }
  );
}
