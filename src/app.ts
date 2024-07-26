// 22FI108
// 三木すみれ
import * as CANNON from 'cannon-es';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { degToRad } from 'three/src/math/MathUtils';

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private camera: THREE.Camera;
    public vehicle: CANNON.RigidVehicle;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする

        //カメラの設定
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.copy(cameraPos);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(this.camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (time) => {
            orbitControls.update();

            renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();


        // グリッド表示
        //const gridHelper = new THREE.GridHelper(10,);
        //this.scene.add(gridHelper);

        // 軸表示
        //const axesHelper = new THREE.AxesHelper(5);
        //this.scene.add(axesHelper);

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        // 空間作成
        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
        world.defaultContactMaterial.restitution = 0.8;
        world.defaultContactMaterial.friction = 0.03;
        const geometry = new THREE.BoxGeometry(0.5, 1, 0.2);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

        // 車
        const carBody = new CANNON.Body({ mass: 5 });
        carBody.position.y = 1;
        const carBodyShape = new CANNON.Box(new CANNON.Vec3(4, 0.5, 2));
        carBody.addShape(carBodyShape);
        this.vehicle = new CANNON.RigidVehicle({ chassisBody: carBody });

        // 車 CG描画
        const boxGeometry = new THREE.BoxGeometry(8, 1, 4);
        const boxMaterial = new THREE.MeshNormalMaterial();
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(boxMesh);

        // タイヤ
        const wheelShape = new CANNON.Sphere(1);

        const frontLeftWheelBody = new CANNON.Body({ mass: 1 });
        frontLeftWheelBody.addShape(wheelShape);
        frontLeftWheelBody.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: frontLeftWheelBody,
            position: new CANNON.Vec3(-2, 0, 2.5)
        });
        const frontRightWheelBody = new CANNON.Body({ mass: 1 });
        frontRightWheelBody.addShape(wheelShape);
        frontRightWheelBody.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: frontRightWheelBody,
            position: new CANNON.Vec3(-2, 0, -2.5)
        });
        const backLeftWheelBody = new CANNON.Body({ mass: 1 });
        backLeftWheelBody.addShape(wheelShape);
        backLeftWheelBody.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: backLeftWheelBody,
            position: new CANNON.Vec3(2, 0, 2.5)
        });
        const backRightWheelBody = new CANNON.Body({ mass: 1 });
        backRightWheelBody.addShape(wheelShape);
        backRightWheelBody.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: backRightWheelBody,
            position: new CANNON.Vec3(2, 0, -2.5)
        });
        // タイヤ CG描画
        const wheelGeometry = new THREE.SphereGeometry(1);
        const wheelMaterial = new THREE.MeshNormalMaterial();

        const frontLeftMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const frontRightMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const backLeftMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const backRightMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(frontLeftMesh);
        this.scene.add(frontRightMesh);
        this.scene.add(backLeftMesh);
        this.scene.add(backRightMesh);

        this.vehicle.addToWorld(world);
        // 地面
        const phongMaterial = new THREE.MeshPhongMaterial();
        const planeGeometry = new THREE.PlaneGeometry(150, 150);
        const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = THREE.DoubleSide; // 両面
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);
        // 物理演算空間での地面
        const planeShape = new CANNON.Plane();
        const planeBody = new CANNON.Body({ mass: 0 }); //重さ0
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        world.addBody(planeBody);


        let update: FrameRequestCallback = (time) => {
            world.fixedStep();

            boxMesh.position.set(carBody.position.x, carBody.position.y, carBody.position.z);
            boxMesh.quaternion.set(carBody.quaternion.x, carBody.quaternion.y, carBody.quaternion.z, carBody.quaternion.w);

            frontLeftMesh.position.set(frontLeftWheelBody.position.x, frontLeftWheelBody.position.y, frontLeftWheelBody.position.z);
            frontLeftMesh.quaternion.set(frontLeftWheelBody.quaternion.x, frontLeftWheelBody.quaternion.y, frontLeftWheelBody.quaternion.z, frontLeftWheelBody.quaternion.w);
            frontRightMesh.position.set(frontRightWheelBody.position.x, frontRightWheelBody.position.y, frontRightWheelBody.position.z);
            frontRightMesh.quaternion.set(frontRightWheelBody.quaternion.x, frontRightWheelBody.quaternion.y, frontRightWheelBody.quaternion.z, frontRightWheelBody.quaternion.w);
            backLeftMesh.position.set(backLeftWheelBody.position.x, backLeftWheelBody.position.y, backLeftWheelBody.position.z);
            backLeftMesh.quaternion.set(backLeftWheelBody.quaternion.x, backLeftWheelBody.quaternion.y, backLeftWheelBody.quaternion.z, backLeftWheelBody.quaternion.w);
            backRightMesh.position.set(backRightWheelBody.position.x, backRightWheelBody.position.y, backRightWheelBody.position.z);
            backRightMesh.quaternion.set(backRightWheelBody.quaternion.x, backRightWheelBody.quaternion.y, backRightWheelBody.quaternion.z, backRightWheelBody.quaternion.w);
            
            //const offset = new THREE.Vector3(20, 10, 0); // カメラの車体からのオフセット
            //this.camera.rotation.set(carBody.quaternion.x,carBody.quaternion.y, carBody.quaternion.z);
            //this.camera.position.set(carBody.position.x+10,carBody.position.y+10,carBody.position.z);
            //this.camera.lookAt(carBody.position.x,carBody.position.y,carBody.position.z);
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

}

window.addEventListener("DOMContentLoaded", init);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            container.vehicle.setWheelForce(10, 0);
            container.vehicle.setWheelForce(10, 1);
            break;
        case 'ArrowDown':
            container.vehicle.setWheelForce(-10, 0);
            container.vehicle.setWheelForce(-10, 1);
            break;
        case 'ArrowLeft':
            container.vehicle.setSteeringValue(degToRad(30), 0);
            container.vehicle.setSteeringValue(degToRad(30), 1);
            break;
        case 'ArrowRight':
            container.vehicle.setSteeringValue(degToRad(-30), 0);
            container.vehicle.setSteeringValue(degToRad(-30), 1);
            break;
    }
});
document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            container.vehicle.setWheelForce(0, 0);
            container.vehicle.setWheelForce(0, 1);
            break;
        case 'ArrowDown':
            container.vehicle.setWheelForce(0, 0);
            container.vehicle.setWheelForce(0, 1);
            break;
        case 'ArrowLeft':
            container.vehicle.setSteeringValue(0, 0);
            container.vehicle.setSteeringValue(0, 1);
            break;
        case 'ArrowRight':
            container.vehicle.setSteeringValue(0, 0);
            container.vehicle.setSteeringValue(0, 1);
            break;
    }
});
// 宣言
let container;
function init() {
    container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(5, 7, 5));
    document.body.appendChild(viewport);
}
