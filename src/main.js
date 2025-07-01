import * as THREE from "three";
import { ArcballControls } from "three/examples/jsm/Addons.js";
import { planets, comets, kuipers } from "./planets";
import { ellipse, degToRad } from "./math";

function orbit(props, color) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.LineBasicMaterial({ color: color });
  const vertices = [];
  const path = ellipse(props.eccentricity, props.semi_major_axis);
  for (const p of path(0, Math.PI * 2, Math.PI / 180.0)) vertices.push(...p);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.rotateY(degToRad(props.argument_of_periapsis));
  geometry.rotateX(degToRad(props.inclination));
  geometry.rotateY(degToRad(props.longitude_of_ascending_node));
  return new THREE.Line(geometry, material);
}

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000.0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const canvas = renderer.domElement;
const scene = new THREE.Scene();
const control = new ArcballControls(camera, canvas, scene);

window.addEventListener("resize", () => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  let a = w / h;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  camera.aspect = a;
  camera.updateProjectionMatrix();
});

function animate() {
  renderer.render(scene, camera);
}

document.body.appendChild(canvas);
control.setGizmosVisible(false);
camera.position.set(0, 100, 0);
camera.lookAt(new THREE.Vector3());

const grid = new THREE.GridHelper(100, 100);
scene.add(grid);

const axes = new THREE.AxesHelper(100);
axes.position.y += 0.002;
scene.add(axes);

for (const planet of planets) scene.add(orbit(planet, "yellow"));
for (const comet of comets) scene.add(orbit(comet, "white"));
for (const kuiper of kuipers) scene.add(orbit(kuiper, "red"));


renderer.setAnimationLoop(animate);
window.dispatchEvent(new Event("resize"));