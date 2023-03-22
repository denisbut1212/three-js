import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {
    AmbientLight,
    AnimationAction,
    AnimationMixer,
    Clock,
    LoopOnce,
    PerspectiveCamera,
    Scene,
    sRGBEncoding,
    WebGLRenderer
} from "three";

const divId: string = 'scene';
const pathToModel: string = './assets/model.glb';
const pathToCamera: string = './assets/camera.glb';

let scene: Scene;
let renderer: WebGLRenderer;
const clock: Clock = new Clock();
const gltfLoader: GLTFLoader = new GLTFLoader();
const div: HTMLElement = document.getElementById(divId) as HTMLElement;
const light = new AmbientLight(0xffffff);

let isLoaded: boolean;
let modelAnimationMixer: AnimationMixer;
let cameraAnimationMixer: AnimationMixer;
let camera: PerspectiveCamera;
let cameraAction: AnimationAction;

init();
animate();

function init(): void {
    scene = new Scene();
    scene.add(light);

    setupRenderer();

    window.addEventListener('resize', onWindowResize, false);

    gltfLoader.load(pathToModel, onModelLoad);
    gltfLoader.load(pathToCamera, onCameraLoad);
}

function animate(): void {
    requestAnimationFrame(animate);

    if (!isLoaded)
        return;

    const deltaTime = clock.getDelta();
    modelAnimationMixer.update(deltaTime);
    cameraAnimationMixer.update(deltaTime);

    renderer.render(scene, camera);
}

function setupRenderer(): void {
    renderer = new WebGLRenderer();
    renderer.setClearColor(0x1a1a1a);
    renderer.setSize(div.clientWidth, div.clientHeight);
    renderer.setPixelRatio(div.clientWidth / div.clientHeight);
    renderer.outputEncoding = sRGBEncoding;
    renderer.domElement.addEventListener('pointerup', OnPointerUp);

    div.appendChild(renderer.domElement);
}

function onWindowResize(): void {
    camera.aspect = div.clientWidth / div.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(div.clientWidth, div.clientHeight);
    renderer.render(scene, camera);
}

function onModelLoad(gltf: GLTF): void {
    const model = gltf.scene;

    scene.add(model)

    modelAnimationMixer = new AnimationMixer(model);

    gltf.animations.forEach((clip) => {
        const anim = modelAnimationMixer.clipAction(clip);
        anim.play();
    })

    isLoaded = true;
}

function onCameraLoad(gltf: GLTF): void {
    camera = gltf.cameras[0] as PerspectiveCamera;
    scene.add(camera);

    cameraAnimationMixer = new AnimationMixer(camera);
    const clip = gltf.animations[0];
    cameraAction = cameraAnimationMixer.clipAction(clip);
    cameraAction.setLoop(LoopOnce, 0);
    cameraAction.clampWhenFinished = true;
}

function OnPointerUp(): void {
    cameraAction.play();
}