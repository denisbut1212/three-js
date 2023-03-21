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

const divName: string = 'scene';
const pathToSceneFile: string = './assets/app.json';

// please do not modify this
const mainModelName: string = 'Red_Fab_zapek.glb';

let isLoaded: boolean;
let scene: Scene;
let camera: PerspectiveCamera;
let mixer: AnimationMixer;

const clock: Clock = new Clock();

const div: HTMLElement = document.getElementById(divName) as HTMLElement;
const fileLoader: FileLoader = new FileLoader();
const renderer: WebGLRenderer = new WebGLRenderer({antialias: true});
renderer.setSize(div.clientWidth, div.clientHeight);
renderer.outputEncoding = sRGBEncoding;

div.appendChild<HTMLCanvasElement>(renderer.domElement)

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
    camera.aspect = div.clientWidth / div.clientHeight;
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

    mixer.update(clock.getDelta())
    renderer.render(scene, camera);
}

animate();