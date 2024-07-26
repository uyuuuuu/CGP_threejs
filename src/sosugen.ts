import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class CherryBlossomScene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private cherryBlossoms: THREE.InstancedMesh;
    private grassInstances: THREE.InstancedMesh;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(new THREE.Color(0x87CEEB));
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.set(0, 0.6, 10);
        this.camera.lookAt(new THREE.Vector3(0, 4, 0));
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.createScene();
        this.createCherryBlossoms();
        this.createGrass();
        this.animate();

        //window.addEventListener('resize', () => this.onWindowResize());
    }

    private createScene(): void {
        // 地面
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x2b802b });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // 環境光追加
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // 平行光追加
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    private createCherryBlossoms(): void {
        const petalCount = 10000;
        const petalGeometry = new THREE.PlaneGeometry(0.2, 0.2);
        const texture = new THREE.TextureLoader().load('sakura.png');
        const petalMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.5,
            depthTest: true,
            depthWrite: true,
            blending: THREE.NormalBlending
        });

        this.cherryBlossoms = new THREE.InstancedMesh(petalGeometry, petalMaterial, petalCount);

        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        for (let i = 0; i < petalCount; i++) {
            position.set(
                Math.random() * 100 - 50,
                Math.random() * 50,
                Math.random() * 100 - 50
            );
            rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            quaternion.setFromEuler(rotation);
            scale.set(1, 1, 1);

            matrix.compose(position, quaternion, scale);
            this.cherryBlossoms.setMatrixAt(i, matrix);
        }

        this.scene.add(this.cherryBlossoms);
    }

    private createGrassMaterial(): THREE.ShaderMaterial {
        const grassTexture = new THREE.TextureLoader().load('grass2.png');

        const vertexShader = `
        uniform float time;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec3 pos = position;
            
            // 草の上部揺らす
            float windStrength = 0.1;
            float windSpeed = 2.0;
            if(pos.y > 0.5) {
                pos.x += sin(time * windSpeed + position.x * 0.5) * windStrength * (pos.y - 0.5);
            }
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
        `;

        const fragmentShader = `
        uniform sampler2D map;
        varying vec2 vUv;
        void main() {
            gl_FragColor = texture2D(map, vUv);
            if(gl_FragColor.a < 0.5) discard; //透明を無視
        }
        `;

        return new THREE.ShaderMaterial({
            uniforms: {
                map: { value: grassTexture },
                time: { value: 0.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.5,
            depthTest: true,
            depthWrite: true,
            blending: THREE.NormalBlending
        });
    }

    private createGrass(): void {
        const grassCount = 100000;
        const grassGeometry = new THREE.PlaneGeometry(0.3, 1.5);
        const grassTexture = new THREE.TextureLoader().load('grass2.png');
        //const grassMaterial = this.createGrassMaterial();
        const grassMaterial = new THREE.MeshBasicMaterial({
            map: grassTexture,
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.5,
            depthTest: true,
            depthWrite: true,
            blending: THREE.NormalBlending
        });

        this.grassInstances = new THREE.InstancedMesh(grassGeometry, grassMaterial, grassCount);

        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        for (let i = 0; i < grassCount; i++) {
            position.set(
                Math.random() * 100 - 50,
                0,
                Math.random() * 100 - 50
            );
            rotation.set(0, Math.random() * Math.PI, 0);
            quaternion.setFromEuler(rotation);
            scale.set(1, 1 + Math.random() * 0.5, 1);

            matrix.compose(position, quaternion, scale);
            this.grassInstances.setMatrixAt(i, matrix);
        }

        this.scene.add(this.grassInstances);
    }

    private animateCherryBlossoms(): void {
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        for (let i = 0; i < this.cherryBlossoms.count; i++) {
            this.cherryBlossoms.getMatrixAt(i, matrix);
            matrix.decompose(position, quaternion, scale);

            position.y -= 0.02;
            if (position.y < 0) {
                position.y = 50;
            }
            position.x += Math.sin(Date.now() * 0.001 + i) * 0.01;

            rotation.setFromQuaternion(quaternion);
            rotation.x += 0.01;
            rotation.y += 0.02;
            rotation.z += 0.03;
            quaternion.setFromEuler(rotation);

            matrix.compose(position, quaternion, scale);
            this.cherryBlossoms.setMatrixAt(i, matrix);
        }
        this.cherryBlossoms.instanceMatrix.needsUpdate = true;
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());

        this.animateCherryBlossoms();

        const time = performance.now() * 0.001; // 秒単位の時間
        // 草のマテリアルの時間を更新
        if (this.grassInstances.material instanceof THREE.ShaderMaterial) {
            this.grassInstances.material.uniforms.time.value = time;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    // private onWindowResize(): void {
    //     this.camera.aspect = window.innerWidth / window.innerHeight;
    //     this.camera.updateProjectionMatrix();
    //     this.renderer.setSize(window.innerWidth, window.innerHeight);
    // }
}

// シーンの作成
new CherryBlossomScene();