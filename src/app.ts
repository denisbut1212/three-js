import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {AnimationMixer, Clock, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer} from "three";

const divId: string = 'scene';
const pathToModel = './assets/scene.gltf';

const scene: Scene = new Scene();
const renderer: WebGLRenderer = new WebGLRenderer();
const clock: Clock = new Clock();
const gltfLoader: GLTFLoader = new GLTFLoader();
const div: HTMLElement = document.getElementById(divId) as HTMLElement;
const camera: PerspectiveCamera = new PerspectiveCamera(
    75,
    div.clientWidth / div.clientHeight,
    0.1,
    10000
);

camera.position.set(0.5, 5, 7);
camera.rotation.set(-0.5, 0, 0);

renderer.setSize(div.clientWidth, div.clientHeight);
renderer.setPixelRatio(div.clientWidth / div.clientHeight);
renderer.outputEncoding = sRGBEncoding;
div.appendChild(renderer.domElement);

let isLoaded: boolean;
let mixer: AnimationMixer;
gltfLoader.load(pathToModel, (gltf) => {

    const model = gltf.scene;
    model.rotation.set(0, 60, 0)

    scene.add(model)

    mixer = new AnimationMixer(model);

    gltf.animations.forEach((clip) => {
        let anim = mixer.clipAction(clip);
        anim.play();
    })

    isLoaded = true;
});

function onWindowResize(): void {
    camera.aspect = div.clientWidth / div.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(div.clientWidth, div.clientHeight);
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function animate(): void {
    requestAnimationFrame(animate);

    if (!isLoaded)
        return;

    const deltaTime = clock.getDelta();
    mixer.update(deltaTime);
    renderer.render(scene, camera);
}

animate();