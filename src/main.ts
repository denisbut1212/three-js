import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

const pathToModel = 'assets/models/Red_Fab_zapek.glb';

const scene = new THREE.Scene();
const stats = Stats();
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();
const gltfLoader = new GLTFLoader();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);
const controls = new OrbitControls(camera, renderer.domElement)

document.body.appendChild(stats.dom);


controls.enableDamping = true;
controls.target.set(1, 0, 0);

camera.position.set(0.5, 5, 5);
camera.rotation.set(-0.5, 0, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let file = await gltfLoader.loadAsync(pathToModel);
let model = file.scene;
model.position.set(0, 0, 0)
model.rotation.set(0, 60, 0)

scene.add(model)

let mixer = new THREE.AnimationMixer(model);

file.animations.forEach((clip) => {
    let anim = mixer.clipAction(clip);
    anim.play();
})

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    stats.update();
    mixer.update(clock.getDelta())

    let deltaTime = clock.getDelta();
    mixer.update(deltaTime);
    renderer.render(scene, camera);
}

animate();