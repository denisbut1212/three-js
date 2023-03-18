import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

const pathToModel = './assets/models/Red_Fab_zapek.glb';

const scene: THREE.Scene = new THREE.Scene();
const stats: Stats = Stats();
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
const clock: THREE.Clock = new THREE.Clock();
const gltfLoader: GLTFLoader = new GLTFLoader();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);
const controls: OrbitControls = new OrbitControls(camera, renderer.domElement)

document.body.appendChild(stats.dom);

controls.enableDamping = true;
controls.target.set(1, 0, 0);

camera.position.set(0.5, 5, 5);
camera.rotation.set(-0.5, 0, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let isLoaded: boolean = false;
let mixer: THREE.AnimationMixer;
gltfLoader.load(pathToModel, (gltf) => {

    const model = gltf.scene;
    model.position.set(0, 0, 0)
    model.rotation.set(0, 60, 0)

    scene.add(model)

    mixer = new THREE.AnimationMixer(model);

    gltf.animations.forEach((clip) => {
        let anim = mixer.clipAction(clip);
        anim.play();
    })

    isLoaded = true;
});

function onWindowResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function animate(): void {
    requestAnimationFrame(animate);
    controls.update();
    stats.update();

    if (isLoaded) {
        const deltaTime = clock.getDelta();
        mixer.update(deltaTime);
    }

    renderer.render(scene, camera);
}

animate();