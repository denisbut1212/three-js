import {
    AnimationMixer,
    Clock,
    FileLoader,
    Object3D,
    ObjectLoader,
    PerspectiveCamera,
    Scene,
    sRGBEncoding,
    WebGLRenderer
} from "three";

let isLoaded: boolean;
let scene: Scene;
let camera: PerspectiveCamera;
let mixer: AnimationMixer;

const clock: Clock = new Clock();
const pathToSceneFile: string = './assets/app.json';
const mainModelName: string = 'Red_Fab_zapek.glb';

const fileLoader: FileLoader = new FileLoader();
const renderer: WebGLRenderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = sRGBEncoding;

document.body.appendChild<HTMLCanvasElement>(renderer.domElement);

fileLoader.load(pathToSceneFile, (text) => {
    LoadFromJson(JSON.parse(text as string));
})

function LoadFromJson(json: any): any {
    const objectLoader: ObjectLoader = new ObjectLoader();
    const project: any = json.project;

    if (project.shadows !== undefined)
        renderer.shadowMap.enabled = project.shadows;
    if (project.shadowType !== undefined)
        renderer.shadowMap.type = project.shadowType;
    if (project.toneMapping !== undefined)
        renderer.toneMapping = project.toneMapping;
    if (project.toneMappingExposure !== undefined)
        renderer.toneMappingExposure = project.toneMappingExposure;

    scene = objectLoader.parse<Scene>(json.scene);

    camera = objectLoader.parse<PerspectiveCamera>(json.camera);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    const mainModel = scene.getObjectByName(mainModelName) as Object3D;
    mixer = new AnimationMixer(mainModel);

    const animations = mainModel.animations;

    animations.forEach(clip => {
        const anim = mixer.clipAction(clip);
        anim.play();
    })

    isLoaded = true;
}

function onWindowResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function animate(): void {
    requestAnimationFrame(animate);

    if (!isLoaded)
        return;

    mixer.update(clock.getDelta())
    renderer.render(scene, camera);
}

animate();