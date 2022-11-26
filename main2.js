import * as three from './files/three.js';

import {OrbitControls} from './files/OrbitControls.js';


let renderer, camera, scene, mesh;
let axesHelper;
let clip, mixer;
let clock = new THREE.Clock();

initRenderer();
initCamera();
initScene();

initLight();
initMeshes();
initAxesHelper();
initControls();

initAnimation();
enableAnimation();

animate();
render();


window.addEventListener('resize', function () {//渲染结果随着窗体的变化而变化（浏览器变窄了，渲染窗口也变窄）
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, this.window.innerHeight);
})


/* ------------------场景三要素初始化------------------- */
function initRenderer() {
    renderer = new THREE.WebGL1Renderer();
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(10, 30, 50);
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x888888);
}
/* ------------------场景三要素初始化------------------- */

function initLight() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 5);
    scene.add(dirLight);
}

function initAxesHelper() {
    axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
}

function initMeshes() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function initControls() {
    const controls = new OrbitControls(camera, renderer.domElement);
}

function initAnimation() {
    //位置
    const positionKF = new THREE.VectorKeyframeTrack(
        '.position',
        [0, 1, 2, 3],
        [
            0, 0, 0,
            10, 0, 0,
            10, 10, 0,
            0, 0, 0
        ]
    );
    //缩放
    const scaleKF = new THREE.VectorKeyframeTrack(
        '.scale',
        [0, 1, 2, 3],
        [
            1, 1, 1,
            2, 2, 2,
            0.5, 2, 2,
            1, 1, 1
        ]
    );

    //旋转
    const xAxis = new THREE.Vector3(1, 0, 0);
    const qInitial = new THREE.Quaternion().
    setFromAxisAngle(xAxis,0);
    const qFinal = new THREE.Quaternion().
    setFromAxisAngle(xAxis,Math.PI);

    const quaternionKF = new THREE.QuaternionKeyframeTrack(
        '.quaternion',
        [0,1,2,3],
        [
            qInitial.x, qInitial.y, qInitial.z, qInitial.w,
            qFinal.x, qFinal.y, qFinal.z, qFinal.w,
            qInitial.x, qInitial.y, qInitial.z, qInitial.w,
            qFinal.x, qFinal.y, qFinal.z, qFinal.w
        ]
    );
    //颜色
    const colorKF = new THREE.ColorKeyframeTrack(
        '.material.color',
        [0,1,2,3],
        [
            1,0,0,
            0,1,0,
            0,0,1,
            0,0,0
        ]
    );

    //透明度
    const opacityKF = new THREE.NumberKeyframeTrack(
        '.material.opacity',
        [0,1,2,3],
        [1,0,1,1]
    );
    


    clip = new THREE.AnimationClip(
        'Action',
        4,
        [positionKF, scaleKF, quaternionKF,colorKF,opacityKF]
    );
}

function enableAnimation() {
    mixer = new THREE.AnimationMixer(mesh);
    const clipAction = mixer.clipAction(clip);
    clipAction.play();
};

function animate() {
    requestAnimationFrame(animate);
    render();
}


function render() {
    const delta = clock.getDelta();
    renderer.render(scene, camera);
    mixer.update(delta);
}
