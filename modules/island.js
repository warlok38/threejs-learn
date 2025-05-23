import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const castShadowNodes = [
  "Object_3",
  "Object_4",
  "Object_5",
  "Object_6",
  "Object_7",
  "Object_8",
  "Object_9",
  "Object_10",
  "Object_11",
  "Object_12",
  "Object_14",
  "Object_15",
  "Object_17",
  "Object_20",
];
const receiveShadowNodes = ["Object_16"];

export function getIsland(scene) {
  const loader = new GLTFLoader();

  loader.load(
    "models/island_platform/scene.gltf",
    (gltf) => {
      let model = gltf.scene;
      model.scale.set(0.55, 0.55, 0.55);
      model.position.set(-3.8, -6.48, -1);

      model.traverse(function (node) {
        if (node.type === "Mesh") {
          if (castShadowNodes.includes(node.name)) {
            node.castShadow = true;
          }
          if (receiveShadowNodes.includes(node.name)) {
            node.receiveShadow = true;
          }
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
