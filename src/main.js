import * as THREE from "three";
import { ArcballControls } from "three/examples/jsm/Addons.js";

import { system } from "./bodies";
import { degToRad } from "./math";
import { orbit, kepler } from "./kepler";

const SPY = 365.0 * 24.0 * 60.0 * 60.0;

function genOrbit(props, color) {
  const group = new THREE.Group();
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.LineBasicMaterial({ color: color });
  const vertices = [];
  const path = orbit(props);
  for (const p of path.o(0.0, Math.PI * 2, Math.PI / 180.0)) vertices.push(...p);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const o = new THREE.Line(geometry, material);
  group.add(o);
  const bodyGeometry = new THREE.SphereGeometry(0.01);
  const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEFA });
  const b = new THREE.Mesh(bodyGeometry, bodyMaterial);
  const p = path.p(degToRad(props.meanAnomaly));
  b.position.set(...p);
  group.add(b);
  return {
    group: group,
    body: b,
    path: path,
    props: props,
    meanAnomaly: props.meanAnomaly,
    period: 2.0 * Math.PI / (props.orbitalPeriod * SPY)
  };
}

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000.0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const canvas = renderer.domElement;
const scene = new THREE.Scene();
const control = new ArcballControls(camera, canvas, scene);
const clock = new THREE.Clock();
const rate = 10000000.0;

window.addEventListener("resize", () => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  let a = w / h;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  camera.aspect = a;
  camera.updateProjectionMatrix();
});

const colors = { planets: "yellow", comets: "white", kuipers: "red" };
const stuff = Object.keys(system).flatMap(k => system[k].map(o => genOrbit(o, colors[k])));
for (const body of stuff) scene.add(body.group);

function animate() {
  const delta = clock.getDelta();
  stuff.forEach(o => {
    o.meanAnomaly += (o.period * delta * rate);
    const trueAnomoly = kepler(o.props.eccentricity, degToRad(o.meanAnomaly)).trueAnomoly;
    o.p = o.path.p(trueAnomoly);
    o.body.position.set(...o.p);
  });
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

document.body.appendChild(canvas);
control.setGizmosVisible(false);

camera.position.set(0, 100, 0);
camera.lookAt(new THREE.Vector3());

const grid = new THREE.GridHelper(100, 100);
scene.add(grid);

const axes = new THREE.AxesHelper(100);
axes.position.y += 0.002;
scene.add(axes);

window.dispatchEvent(new Event("resize"));