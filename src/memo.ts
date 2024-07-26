// 背景に星空を追加
// const starGeometry = new THREE.BufferGeometry();
// const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF });
// const starVertices = [];
// for (let i = 0; i < 10000; i++) {
//     const x = THREE.MathUtils.randFloatSpread(2000);
//     const y = THREE.MathUtils.randFloatSpread(2000);
//     const z = THREE.MathUtils.randFloatSpread(2000);
//     starVertices.push(x, y, z);
// }
// starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
// const stars = new THREE.Points(starGeometry, starMaterial);
// this.scene.add(stars);


// import GLTFLoader from 'three-gltf-loader';
// // モデル読み込み
// const loader = new GLTFLoader();
// async function loadModel(){
//     try {
//         const gltf = await loader.loadAsync('../model/doors.glb');
//         const model = gltf.scene;
//         model.position.set(0, 0, 0);
//         model.scale.set(1.5, 1.5, 1.5);
//         scene.add(model);
//         console.log('Model loaded successfully');
//         // モデルが読み込まれた後にアニメーションを開始
//         tick();
//     } catch (error) {
//         console.error('An error happened', error);
//     }
// }
// loadModel();