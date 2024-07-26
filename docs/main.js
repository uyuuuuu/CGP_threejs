/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");


class CherryBlossomScene {
    scene;
    camera;
    renderer;
    controls;
    cherryBlossoms;
    grassInstances;
    constructor() {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x87CEEB));
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.set(0, 0.6, 10);
        this.camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 4, 0));
        this.controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(this.camera, this.renderer.domElement);
        this.createScene();
        this.createCherryBlossoms();
        this.createGrass();
        this.animate();
        //window.addEventListener('resize', () => this.onWindowResize());
    }
    createScene() {
        // 地面
        const groundGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(100, 100);
        const groundMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: 0x2b802b });
        const ground = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);
        // 環境光追加
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        // 平行光追加
        const directionalLight = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }
    createCherryBlossoms() {
        const petalCount = 10000;
        const petalGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(0.2, 0.2);
        const texture = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader().load('sakura.png');
        const petalMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide,
            alphaTest: 0.5,
            depthTest: true,
            depthWrite: true,
            blending: three__WEBPACK_IMPORTED_MODULE_1__.NormalBlending
        });
        this.cherryBlossoms = new three__WEBPACK_IMPORTED_MODULE_1__.InstancedMesh(petalGeometry, petalMaterial, petalCount);
        const matrix = new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4();
        const position = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        const rotation = new three__WEBPACK_IMPORTED_MODULE_1__.Euler();
        const quaternion = new three__WEBPACK_IMPORTED_MODULE_1__.Quaternion();
        const scale = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        for (let i = 0; i < petalCount; i++) {
            position.set(Math.random() * 100 - 50, Math.random() * 50, Math.random() * 100 - 50);
            rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            quaternion.setFromEuler(rotation);
            scale.set(1, 1, 1);
            matrix.compose(position, quaternion, scale);
            this.cherryBlossoms.setMatrixAt(i, matrix);
        }
        this.scene.add(this.cherryBlossoms);
    }
    createGrassMaterial() {
        const grassTexture = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader().load('grass2.png');
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
        return new three__WEBPACK_IMPORTED_MODULE_1__.ShaderMaterial({
            uniforms: {
                map: { value: grassTexture },
                time: { value: 0.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide,
            alphaTest: 0.5,
            depthTest: true,
            depthWrite: true,
            blending: three__WEBPACK_IMPORTED_MODULE_1__.NormalBlending
        });
    }
    createGrass() {
        const grassCount = 100000;
        const grassGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(0.3, 1.5);
        const grassTexture = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader().load('grass2.png');
        //const grassMaterial = this.createGrassMaterial();
        const grassMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({
            map: grassTexture,
            transparent: true,
            side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide,
            alphaTest: 0.5,
            depthTest: true,
            depthWrite: true,
            blending: three__WEBPACK_IMPORTED_MODULE_1__.NormalBlending
        });
        this.grassInstances = new three__WEBPACK_IMPORTED_MODULE_1__.InstancedMesh(grassGeometry, grassMaterial, grassCount);
        const matrix = new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4();
        const position = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        const rotation = new three__WEBPACK_IMPORTED_MODULE_1__.Euler();
        const quaternion = new three__WEBPACK_IMPORTED_MODULE_1__.Quaternion();
        const scale = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        for (let i = 0; i < grassCount; i++) {
            position.set(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
            rotation.set(0, Math.random() * Math.PI, 0);
            quaternion.setFromEuler(rotation);
            scale.set(1, 1 + Math.random() * 0.5, 1);
            matrix.compose(position, quaternion, scale);
            this.grassInstances.setMatrixAt(i, matrix);
        }
        this.scene.add(this.grassInstances);
    }
    animateCherryBlossoms() {
        const matrix = new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4();
        const position = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        const rotation = new three__WEBPACK_IMPORTED_MODULE_1__.Euler();
        const quaternion = new three__WEBPACK_IMPORTED_MODULE_1__.Quaternion();
        const scale = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
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
    animate() {
        requestAnimationFrame(() => this.animate());
        this.animateCherryBlossoms();
        const time = performance.now() * 0.001; // 秒単位の時間
        // 草のマテリアルの時間を更新
        if (this.grassInstances.material instanceof three__WEBPACK_IMPORTED_MODULE_1__.ShaderMaterial) {
            this.grassInstances.material.uniforms.time.value = time;
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
// シーンの作成
new CherryBlossomScene();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Li9zcmMvYXBwLnRzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzJztcblxuY2xhc3MgQ2hlcnJ5Qmxvc3NvbVNjZW5lIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gICAgcHJpdmF0ZSByZW5kZXJlcjogVEhSRUUuV2ViR0xSZW5kZXJlcjtcbiAgICBwcml2YXRlIGNvbnRyb2xzOiBPcmJpdENvbnRyb2xzO1xuICAgIHByaXZhdGUgY2hlcnJ5Qmxvc3NvbXM6IFRIUkVFLkluc3RhbmNlZE1lc2g7XG4gICAgcHJpdmF0ZSBncmFzc0luc3RhbmNlczogVEhSRUUuSW5zdGFuY2VkTWVzaDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg4N0NFRUIpKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgICAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi5zZXQoMCwgMC42LCAxMCk7XG4gICAgICAgIHRoaXMuY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCA0LCAwKSk7XG4gICAgICAgIHRoaXMuY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyh0aGlzLmNhbWVyYSwgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2hlcnJ5Qmxvc3NvbXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVHcmFzcygpO1xuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcblxuICAgICAgICAvL3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLm9uV2luZG93UmVzaXplKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlU2NlbmUoKTogdm9pZCB7XG4gICAgICAgIC8vIOWcsOmdolxuICAgICAgICBjb25zdCBncm91bmRHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDEwMCwgMTAwKTtcbiAgICAgICAgY29uc3QgZ3JvdW5kTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHgyYjgwMmIgfSk7XG4gICAgICAgIGNvbnN0IGdyb3VuZCA9IG5ldyBUSFJFRS5NZXNoKGdyb3VuZEdlb21ldHJ5LCBncm91bmRNYXRlcmlhbCk7XG4gICAgICAgIGdyb3VuZC5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChncm91bmQpO1xuXG4gICAgICAgIC8vIOeSsOWig+WFiei/veWKoFxuICAgICAgICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjUpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xuXG4gICAgICAgIC8vIOW5s+ihjOWFiei/veWKoFxuICAgICAgICBjb25zdCBkaXJlY3Rpb25hbExpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuNSk7XG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQucG9zaXRpb24uc2V0KDEsIDEsIDEpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNoZXJyeUJsb3Nzb21zKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBwZXRhbENvdW50ID0gMTAwMDA7XG4gICAgICAgIGNvbnN0IHBldGFsR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgwLjIsIDAuMik7XG4gICAgICAgIGNvbnN0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpLmxvYWQoJ3Nha3VyYS5wbmcnKTtcbiAgICAgICAgY29uc3QgcGV0YWxNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgICBtYXA6IHRleHR1cmUsXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgICAgICAgICBhbHBoYVRlc3Q6IDAuNSxcbiAgICAgICAgICAgIGRlcHRoVGVzdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlcHRoV3JpdGU6IHRydWUsXG4gICAgICAgICAgICBibGVuZGluZzogVEhSRUUuTm9ybWFsQmxlbmRpbmdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jaGVycnlCbG9zc29tcyA9IG5ldyBUSFJFRS5JbnN0YW5jZWRNZXNoKHBldGFsR2VvbWV0cnksIHBldGFsTWF0ZXJpYWwsIHBldGFsQ291bnQpO1xuXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICAgICAgY29uc3Qgcm90YXRpb24gPSBuZXcgVEhSRUUuRXVsZXIoKTtcbiAgICAgICAgY29uc3QgcXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCk7XG4gICAgICAgIGNvbnN0IHNjYWxlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBldGFsQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgcG9zaXRpb24uc2V0KFxuICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAxMDAgLSA1MCxcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogNTAsXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIDEwMCAtIDUwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcm90YXRpb24uc2V0KFxuICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJLFxuICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJLFxuICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcXVhdGVybmlvbi5zZXRGcm9tRXVsZXIocm90YXRpb24pO1xuICAgICAgICAgICAgc2NhbGUuc2V0KDEsIDEsIDEpO1xuXG4gICAgICAgICAgICBtYXRyaXguY29tcG9zZShwb3NpdGlvbiwgcXVhdGVybmlvbiwgc2NhbGUpO1xuICAgICAgICAgICAgdGhpcy5jaGVycnlCbG9zc29tcy5zZXRNYXRyaXhBdChpLCBtYXRyaXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jaGVycnlCbG9zc29tcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVHcmFzc01hdGVyaWFsKCk6IFRIUkVFLlNoYWRlck1hdGVyaWFsIHtcbiAgICAgICAgY29uc3QgZ3Jhc3NUZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKS5sb2FkKCdncmFzczIucG5nJyk7XG5cbiAgICAgICAgY29uc3QgdmVydGV4U2hhZGVyID0gYFxuICAgICAgICB1bmlmb3JtIGZsb2F0IHRpbWU7XG4gICAgICAgIHZhcnlpbmcgdmVjMiB2VXY7XG4gICAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgICAgIHZVdiA9IHV2O1xuICAgICAgICAgICAgdmVjMyBwb3MgPSBwb3NpdGlvbjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6I2J44Gu5LiK6YOo5o+644KJ44GZXG4gICAgICAgICAgICBmbG9hdCB3aW5kU3RyZW5ndGggPSAwLjE7XG4gICAgICAgICAgICBmbG9hdCB3aW5kU3BlZWQgPSAyLjA7XG4gICAgICAgICAgICBpZihwb3MueSA+IDAuNSkge1xuICAgICAgICAgICAgICAgIHBvcy54ICs9IHNpbih0aW1lICogd2luZFNwZWVkICsgcG9zaXRpb24ueCAqIDAuNSkgKiB3aW5kU3RyZW5ndGggKiAocG9zLnkgLSAwLjUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KHBvcywgMS4wKTtcbiAgICAgICAgfVxuICAgICAgICBgO1xuXG4gICAgICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gYFxuICAgICAgICB1bmlmb3JtIHNhbXBsZXIyRCBtYXA7XG4gICAgICAgIHZhcnlpbmcgdmVjMiB2VXY7XG4gICAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRChtYXAsIHZVdik7XG4gICAgICAgICAgICBpZihnbF9GcmFnQ29sb3IuYSA8IDAuNSkgZGlzY2FyZDsgLy/pgI/mmI7jgpLnhKHoppZcbiAgICAgICAgfVxuICAgICAgICBgO1xuXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xuICAgICAgICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgICAgICAgICBtYXA6IHsgdmFsdWU6IGdyYXNzVGV4dHVyZSB9LFxuICAgICAgICAgICAgICAgIHRpbWU6IHsgdmFsdWU6IDAuMCB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmVydGV4U2hhZGVyOiB2ZXJ0ZXhTaGFkZXIsXG4gICAgICAgICAgICBmcmFnbWVudFNoYWRlcjogZnJhZ21lbnRTaGFkZXIsXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgICAgICAgICBhbHBoYVRlc3Q6IDAuNSxcbiAgICAgICAgICAgIGRlcHRoVGVzdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlcHRoV3JpdGU6IHRydWUsXG4gICAgICAgICAgICBibGVuZGluZzogVEhSRUUuTm9ybWFsQmxlbmRpbmdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVHcmFzcygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZ3Jhc3NDb3VudCA9IDEwMDAwMDtcbiAgICAgICAgY29uc3QgZ3Jhc3NHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDAuMywgMS41KTtcbiAgICAgICAgY29uc3QgZ3Jhc3NUZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKS5sb2FkKCdncmFzczIucG5nJyk7XG4gICAgICAgIC8vY29uc3QgZ3Jhc3NNYXRlcmlhbCA9IHRoaXMuY3JlYXRlR3Jhc3NNYXRlcmlhbCgpO1xuICAgICAgICBjb25zdCBncmFzc01hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgIG1hcDogZ3Jhc3NUZXh0dXJlLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgICAgICAgICAgYWxwaGFUZXN0OiAwLjUsXG4gICAgICAgICAgICBkZXB0aFRlc3Q6IHRydWUsXG4gICAgICAgICAgICBkZXB0aFdyaXRlOiB0cnVlLFxuICAgICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLk5vcm1hbEJsZW5kaW5nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ3Jhc3NJbnN0YW5jZXMgPSBuZXcgVEhSRUUuSW5zdGFuY2VkTWVzaChncmFzc0dlb21ldHJ5LCBncmFzc01hdGVyaWFsLCBncmFzc0NvdW50KTtcblxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgICAgIGNvbnN0IHJvdGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKCk7XG4gICAgICAgIGNvbnN0IHF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmFzc0NvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHBvc2l0aW9uLnNldChcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogMTAwIC0gNTAsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogMTAwIC0gNTBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByb3RhdGlvbi5zZXQoMCwgTWF0aC5yYW5kb20oKSAqIE1hdGguUEksIDApO1xuICAgICAgICAgICAgcXVhdGVybmlvbi5zZXRGcm9tRXVsZXIocm90YXRpb24pO1xuICAgICAgICAgICAgc2NhbGUuc2V0KDEsIDEgKyBNYXRoLnJhbmRvbSgpICogMC41LCAxKTtcblxuICAgICAgICAgICAgbWF0cml4LmNvbXBvc2UocG9zaXRpb24sIHF1YXRlcm5pb24sIHNjYWxlKTtcbiAgICAgICAgICAgIHRoaXMuZ3Jhc3NJbnN0YW5jZXMuc2V0TWF0cml4QXQoaSwgbWF0cml4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuZ3Jhc3NJbnN0YW5jZXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZUNoZXJyeUJsb3Nzb21zKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgICAgIGNvbnN0IHJvdGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKCk7XG4gICAgICAgIGNvbnN0IHF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoZXJyeUJsb3Nzb21zLmNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2hlcnJ5Qmxvc3NvbXMuZ2V0TWF0cml4QXQoaSwgbWF0cml4KTtcbiAgICAgICAgICAgIG1hdHJpeC5kZWNvbXBvc2UocG9zaXRpb24sIHF1YXRlcm5pb24sIHNjYWxlKTtcblxuICAgICAgICAgICAgcG9zaXRpb24ueSAtPSAwLjAyO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnkgPCAwKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueSA9IDUwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zaXRpb24ueCArPSBNYXRoLnNpbihEYXRlLm5vdygpICogMC4wMDEgKyBpKSAqIDAuMDE7XG5cbiAgICAgICAgICAgIHJvdGF0aW9uLnNldEZyb21RdWF0ZXJuaW9uKHF1YXRlcm5pb24pO1xuICAgICAgICAgICAgcm90YXRpb24ueCArPSAwLjAxO1xuICAgICAgICAgICAgcm90YXRpb24ueSArPSAwLjAyO1xuICAgICAgICAgICAgcm90YXRpb24ueiArPSAwLjAzO1xuICAgICAgICAgICAgcXVhdGVybmlvbi5zZXRGcm9tRXVsZXIocm90YXRpb24pO1xuXG4gICAgICAgICAgICBtYXRyaXguY29tcG9zZShwb3NpdGlvbiwgcXVhdGVybmlvbiwgc2NhbGUpO1xuICAgICAgICAgICAgdGhpcy5jaGVycnlCbG9zc29tcy5zZXRNYXRyaXhBdChpLCBtYXRyaXgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlcnJ5Qmxvc3NvbXMuaW5zdGFuY2VNYXRyaXgubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW5pbWF0ZSgpOiB2b2lkIHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYW5pbWF0ZSgpKTtcblxuICAgICAgICB0aGlzLmFuaW1hdGVDaGVycnlCbG9zc29tcygpO1xuXG4gICAgICAgIGNvbnN0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKSAqIDAuMDAxOyAvLyDnp5LljZjkvY3jga7mmYLplpNcbiAgICAgICAgLy8g6I2J44Gu44Oe44OG44Oq44Ki44Or44Gu5pmC6ZaT44KS5pu05pawXG4gICAgICAgIGlmICh0aGlzLmdyYXNzSW5zdGFuY2VzLm1hdGVyaWFsIGluc3RhbmNlb2YgVEhSRUUuU2hhZGVyTWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHRoaXMuZ3Jhc3NJbnN0YW5jZXMubWF0ZXJpYWwudW5pZm9ybXMudGltZS52YWx1ZSA9IHRpbWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZSBvbldpbmRvd1Jlc2l6ZSgpOiB2b2lkIHtcbiAgICAvLyAgICAgdGhpcy5jYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgLy8gICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICAvLyAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIC8vIH1cbn1cblxuLy8g44K344O844Oz44Gu5L2c5oiQXG5uZXcgQ2hlcnJ5Qmxvc3NvbVNjZW5lKCk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiaXRDb250cm9sc19qc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==