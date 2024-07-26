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


class SakuraScene {
    scene;
    camera;
    renderer;
    controls;
    sakuras;
    grassInstances;
    grassMaterial;
    constructor() {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x87CEEB)); //空
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.set(0, 0.6, 10);
        this.camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 4, 0));
        this.controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(this.camera, this.renderer.domElement);
        this.createScene();
        this.createSakura();
        this.createGrass();
        this.animate();
    }
    createScene() {
        // 地面
        const groundGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(100, 100);
        const groundMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: 0x2b802b });
        const ground = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; //水平に
        this.scene.add(ground);
        // 環境光追加
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        // 平行光追加
        const directionalLight = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }
    createSakura() {
        const sakuraCount = 10000;
        const sakuraGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(0.2, 0.2);
        const texture = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader().load('sakura.png');
        const sakuraMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide,
            alphaTest: 0.5,
            depthTest: true,
            depthWrite: true,
            blending: three__WEBPACK_IMPORTED_MODULE_1__.NormalBlending
        });
        this.sakuras = new three__WEBPACK_IMPORTED_MODULE_1__.InstancedMesh(sakuraGeometry, sakuraMaterial, sakuraCount);
        const matrix = new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4();
        const position = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        const rotation = new three__WEBPACK_IMPORTED_MODULE_1__.Euler();
        const quaternion = new three__WEBPACK_IMPORTED_MODULE_1__.Quaternion();
        const scale = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        // 桜の配置
        for (let i = 0; i < sakuraCount; i++) {
            // 位置
            position.set(Math.random() * 100 - 50, Math.random() * 50, Math.random() * 100 - 50);
            // 回転
            rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            quaternion.setFromEuler(rotation);
            scale.set(1, 1, 1);
            matrix.compose(position, quaternion, scale);
            this.sakuras.setMatrixAt(i, matrix);
        }
        this.scene.add(this.sakuras);
    }
    createGrassMaterial() {
        const grassTexture = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader().load('grass2.png');
        const vertexShader = `
            uniform float time;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vec3 pos = position;
                
                // 草の上部を揺らす
                float windStrength = 0.1; //ゆらゆら度
                float windSpeed = 2.0; //速度
                if(pos.y > 0.5) { //上側
                    // ワールド位置に応じてsin, 上ほど大きくゆらゆら
                    pos.x += sin(time*windSpeed + instanceMatrix[3].x * 0.5 + instanceMatrix[3].z * 0.5) * windStrength * (pos.y - 0.5);
                }
                
                vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        const fragmentShader = `
            uniform sampler2D map;
            varying vec2 vUv;
            void main() {
                gl_FragColor = texture2D(map, vUv);
                if(gl_FragColor.a < 0.5) discard; // 透明を無視
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
        this.grassMaterial = this.createGrassMaterial();
        // 草が多いからインスタンス化
        this.grassInstances = new three__WEBPACK_IMPORTED_MODULE_1__.InstancedMesh(grassGeometry, this.grassMaterial, grassCount);
        const matrix = new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4();
        const position = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        const rotation = new three__WEBPACK_IMPORTED_MODULE_1__.Euler();
        const quaternion = new three__WEBPACK_IMPORTED_MODULE_1__.Quaternion();
        const scale = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        // 草の配置
        for (let i = 0; i < grassCount; i++) {
            position.set(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
            // yだけランダム
            rotation.set(0, Math.random() * Math.PI, 0);
            quaternion.setFromEuler(rotation);
            // 大きさちょっとランダムに
            scale.set(1, 1 + Math.random() * 0.5, 1);
            matrix.compose(position, quaternion, scale);
            this.grassInstances.setMatrixAt(i, matrix);
        }
        // 草追加
        this.scene.add(this.grassInstances);
    }
    animateSakuras() {
        const matrix = new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4();
        const position = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        const rotation = new three__WEBPACK_IMPORTED_MODULE_1__.Euler();
        const quaternion = new three__WEBPACK_IMPORTED_MODULE_1__.Quaternion();
        const scale = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        for (let i = 0; i < this.sakuras.count; i++) {
            this.sakuras.getMatrixAt(i, matrix);
            matrix.decompose(position, quaternion, scale);
            position.y -= 0.02; //落ちてく
            if (position.y < 0) {
                position.y = 50; //上に戻す
            }
            position.x += Math.sin(Date.now() * 0.001 + i) * 0.01;
            rotation.setFromQuaternion(quaternion);
            rotation.x += 0.01;
            rotation.y += 0.02;
            rotation.z += 0.03;
            quaternion.setFromEuler(rotation);
            matrix.compose(position, quaternion, scale);
            this.sakuras.setMatrixAt(i, matrix);
        }
        this.sakuras.instanceMatrix.needsUpdate = true;
    }
    animate() {
        requestAnimationFrame(() => this.animate());
        this.animateSakuras();
        const time = performance.now() * 0.001; // 秒で更新
        // 草のマテリアルの時間更新
        this.grassMaterial.uniforms.time.value = time;
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
// シーン
new SakuraScene();


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scyc7XG5cbmNsYXNzIFNha3VyYVNjZW5lIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gICAgcHJpdmF0ZSByZW5kZXJlcjogVEhSRUUuV2ViR0xSZW5kZXJlcjtcbiAgICBwcml2YXRlIGNvbnRyb2xzOiBPcmJpdENvbnRyb2xzO1xuICAgIHByaXZhdGUgc2FrdXJhczogVEhSRUUuSW5zdGFuY2VkTWVzaDtcbiAgICBwcml2YXRlIGdyYXNzSW5zdGFuY2VzOiBUSFJFRS5JbnN0YW5jZWRNZXNoO1xuICAgIHByaXZhdGUgZ3Jhc3NNYXRlcmlhbDogVEhSRUUuU2hhZGVyTWF0ZXJpYWw7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4ODdDRUVCKSk7IC8v56m6XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnNldCgwLCAwLjYsIDEwKTtcbiAgICAgICAgdGhpcy5jYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDQsIDApKTtcbiAgICAgICAgdGhpcy5jb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKHRoaXMuY2FtZXJhLCB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVTYWt1cmEoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVHcmFzcygpO1xuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lKCk6IHZvaWQge1xuICAgICAgICAvLyDlnLDpnaJcbiAgICAgICAgY29uc3QgZ3JvdW5kR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxMDAsIDEwMCk7XG4gICAgICAgIGNvbnN0IGdyb3VuZE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4MmI4MDJiIH0pO1xuICAgICAgICBjb25zdCBncm91bmQgPSBuZXcgVEhSRUUuTWVzaChncm91bmRHZW9tZXRyeSwgZ3JvdW5kTWF0ZXJpYWwpO1xuICAgICAgICBncm91bmQucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjsgLy/msLTlubPjgatcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZ3JvdW5kKTtcblxuICAgICAgICAvLyDnkrDlooPlhYnov73liqBcbiAgICAgICAgY29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMC41KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcblxuICAgICAgICAvLyDlubPooYzlhYnov73liqBcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uYWxMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjUpO1xuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0LnBvc2l0aW9uLnNldCgxLCAxLCAxKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTYWt1cmEoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNha3VyYUNvdW50ID0gMTAwMDA7XG4gICAgICAgIGNvbnN0IHNha3VyYUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMC4yLCAwLjIpO1xuICAgICAgICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKS5sb2FkKCdzYWt1cmEucG5nJyk7XG4gICAgICAgIGNvbnN0IHNha3VyYU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgIG1hcDogdGV4dHVyZSxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICAgICAgICAgIGFscGhhVGVzdDogMC41LFxuICAgICAgICAgICAgZGVwdGhUZXN0OiB0cnVlLFxuICAgICAgICAgICAgZGVwdGhXcml0ZTogdHJ1ZSxcbiAgICAgICAgICAgIGJsZW5kaW5nOiBUSFJFRS5Ob3JtYWxCbGVuZGluZ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNha3VyYXMgPSBuZXcgVEhSRUUuSW5zdGFuY2VkTWVzaChzYWt1cmFHZW9tZXRyeSwgc2FrdXJhTWF0ZXJpYWwsIHNha3VyYUNvdW50KTtcblxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgICAgIGNvbnN0IHJvdGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKCk7XG4gICAgICAgIGNvbnN0IHF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgICAgIC8vIOahnOOBrumFjee9rlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNha3VyYUNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIC8vIOS9jee9rlxuICAgICAgICAgICAgcG9zaXRpb24uc2V0KFxuICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAxMDAgLSA1MCxcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogNTAsXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIDEwMCAtIDUwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgLy8g5Zue6LuiXG4gICAgICAgICAgICByb3RhdGlvbi5zZXQoXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIE1hdGguUEksXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIE1hdGguUEksXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIE1hdGguUElcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBxdWF0ZXJuaW9uLnNldEZyb21FdWxlcihyb3RhdGlvbik7XG4gICAgICAgICAgICBzY2FsZS5zZXQoMSwgMSwgMSk7XG5cbiAgICAgICAgICAgIG1hdHJpeC5jb21wb3NlKHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCBzY2FsZSk7XG4gICAgICAgICAgICB0aGlzLnNha3VyYXMuc2V0TWF0cml4QXQoaSwgbWF0cml4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuc2FrdXJhcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVHcmFzc01hdGVyaWFsKCk6IFRIUkVFLlNoYWRlck1hdGVyaWFsIHtcbiAgICAgICAgY29uc3QgZ3Jhc3NUZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKS5sb2FkKCdncmFzczIucG5nJyk7XG5cbiAgICAgICAgY29uc3QgdmVydGV4U2hhZGVyID0gYFxuICAgICAgICAgICAgdW5pZm9ybSBmbG9hdCB0aW1lO1xuICAgICAgICAgICAgdmFyeWluZyB2ZWMyIHZVdjtcbiAgICAgICAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgICAgICAgICB2VXYgPSB1djtcbiAgICAgICAgICAgICAgICB2ZWMzIHBvcyA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOiNieOBruS4iumDqOOCkuaPuuOCieOBmVxuICAgICAgICAgICAgICAgIGZsb2F0IHdpbmRTdHJlbmd0aCA9IDAuMTsgLy/jgobjgonjgobjgonluqZcbiAgICAgICAgICAgICAgICBmbG9hdCB3aW5kU3BlZWQgPSAyLjA7IC8v6YCf5bqmXG4gICAgICAgICAgICAgICAgaWYocG9zLnkgPiAwLjUpIHsgLy/kuIrlgbRcbiAgICAgICAgICAgICAgICAgICAgLy8g44Ov44O844Or44OJ5L2N572u44Gr5b+c44GY44Gmc2luLCDkuIrjgbvjganlpKfjgY3jgY/jgobjgonjgobjgolcbiAgICAgICAgICAgICAgICAgICAgcG9zLnggKz0gc2luKHRpbWUqd2luZFNwZWVkICsgaW5zdGFuY2VNYXRyaXhbM10ueCAqIDAuNSArIGluc3RhbmNlTWF0cml4WzNdLnogKiAwLjUpICogd2luZFN0cmVuZ3RoICogKHBvcy55IC0gMC41KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmVjNCBtdlBvc2l0aW9uID0gbW9kZWxWaWV3TWF0cml4ICogaW5zdGFuY2VNYXRyaXggKiB2ZWM0KHBvcywgMS4wKTtcbiAgICAgICAgICAgICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtdlBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICBgO1xuXG4gICAgICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gYFxuICAgICAgICAgICAgdW5pZm9ybSBzYW1wbGVyMkQgbWFwO1xuICAgICAgICAgICAgdmFyeWluZyB2ZWMyIHZVdjtcbiAgICAgICAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQobWFwLCB2VXYpO1xuICAgICAgICAgICAgICAgIGlmKGdsX0ZyYWdDb2xvci5hIDwgMC41KSBkaXNjYXJkOyAvLyDpgI/mmI7jgpLnhKHoppZcbiAgICAgICAgICAgIH1cbiAgICAgICAgYDtcblxuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKHtcbiAgICAgICAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgICAgICAgICAgbWFwOiB7IHZhbHVlOiBncmFzc1RleHR1cmUgfSxcbiAgICAgICAgICAgICAgICB0aW1lOiB7IHZhbHVlOiAwLjAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZlcnRleFNoYWRlcjogdmVydGV4U2hhZGVyLFxuICAgICAgICAgICAgZnJhZ21lbnRTaGFkZXI6IGZyYWdtZW50U2hhZGVyLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLCAvL+S4oeWBtFxuICAgICAgICAgICAgYWxwaGFUZXN0OiAwLjUsXG4gICAgICAgICAgICBkZXB0aFRlc3Q6IHRydWUsXG4gICAgICAgICAgICBkZXB0aFdyaXRlOiB0cnVlLFxuICAgICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLk5vcm1hbEJsZW5kaW5nXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlR3Jhc3MoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGdyYXNzQ291bnQgPSAxMDAwMDA7XG4gICAgICAgIGNvbnN0IGdyYXNzR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgwLjMsIDEuNSk7XG4gICAgICAgIHRoaXMuZ3Jhc3NNYXRlcmlhbCA9IHRoaXMuY3JlYXRlR3Jhc3NNYXRlcmlhbCgpO1xuICAgICAgICAvLyDojYnjgYzlpJrjgYTjgYvjgonjgqTjg7Pjgrnjgr/jg7PjgrnljJZcbiAgICAgICAgdGhpcy5ncmFzc0luc3RhbmNlcyA9IG5ldyBUSFJFRS5JbnN0YW5jZWRNZXNoKGdyYXNzR2VvbWV0cnksIHRoaXMuZ3Jhc3NNYXRlcmlhbCwgZ3Jhc3NDb3VudCk7XG5cbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgICAgICBjb25zdCByb3RhdGlvbiA9IG5ldyBUSFJFRS5FdWxlcigpO1xuICAgICAgICBjb25zdCBxdWF0ZXJuaW9uID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcbiAgICAgICAgY29uc3Qgc2NhbGUgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgICAgICAvLyDojYnjga7phY3nva5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmFzc0NvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHBvc2l0aW9uLnNldChcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogMTAwIC0gNTAsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogMTAwIC0gNTBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvLyB544Gg44GR44Op44Oz44OA44OgXG4gICAgICAgICAgICByb3RhdGlvbi5zZXQoMCwgTWF0aC5yYW5kb20oKSAqIE1hdGguUEksIDApO1xuICAgICAgICAgICAgcXVhdGVybmlvbi5zZXRGcm9tRXVsZXIocm90YXRpb24pO1xuICAgICAgICAgICAgLy8g5aSn44GN44GV44Gh44KH44Gj44Go44Op44Oz44OA44Og44GrXG4gICAgICAgICAgICBzY2FsZS5zZXQoMSwgMSArIE1hdGgucmFuZG9tKCkgKiAwLjUsIDEpO1xuXG4gICAgICAgICAgICBtYXRyaXguY29tcG9zZShwb3NpdGlvbiwgcXVhdGVybmlvbiwgc2NhbGUpO1xuICAgICAgICAgICAgdGhpcy5ncmFzc0luc3RhbmNlcy5zZXRNYXRyaXhBdChpLCBtYXRyaXgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIOiNiei/veWKoFxuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmdyYXNzSW5zdGFuY2VzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVTYWt1cmFzKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgICAgIGNvbnN0IHJvdGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKCk7XG4gICAgICAgIGNvbnN0IHF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNha3VyYXMuY291bnQ7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zYWt1cmFzLmdldE1hdHJpeEF0KGksIG1hdHJpeCk7XG4gICAgICAgICAgICBtYXRyaXguZGVjb21wb3NlKHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCBzY2FsZSk7XG5cbiAgICAgICAgICAgIHBvc2l0aW9uLnkgLT0gMC4wMjsgLy/okL3jgaHjgabjgY9cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi55IDwgMCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgPSA1MDsgLy/kuIrjgavmiLvjgZlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc2l0aW9uLnggKz0gTWF0aC5zaW4oRGF0ZS5ub3coKSAqIDAuMDAxICsgaSkgKiAwLjAxO1xuXG4gICAgICAgICAgICByb3RhdGlvbi5zZXRGcm9tUXVhdGVybmlvbihxdWF0ZXJuaW9uKTtcbiAgICAgICAgICAgIHJvdGF0aW9uLnggKz0gMC4wMTtcbiAgICAgICAgICAgIHJvdGF0aW9uLnkgKz0gMC4wMjtcbiAgICAgICAgICAgIHJvdGF0aW9uLnogKz0gMC4wMztcbiAgICAgICAgICAgIHF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKHJvdGF0aW9uKTtcblxuICAgICAgICAgICAgbWF0cml4LmNvbXBvc2UocG9zaXRpb24sIHF1YXRlcm5pb24sIHNjYWxlKTtcbiAgICAgICAgICAgIHRoaXMuc2FrdXJhcy5zZXRNYXRyaXhBdChpLCBtYXRyaXgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2FrdXJhcy5pbnN0YW5jZU1hdHJpeC5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhbmltYXRlKCk6IHZvaWQge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hbmltYXRlKCkpO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0ZVNha3VyYXMoKTtcblxuICAgICAgICBjb25zdCB0aW1lID0gcGVyZm9ybWFuY2Uubm93KCkgKiAwLjAwMTsgLy8g56eS44Gn5pu05pawXG4gICAgICAgIC8vIOiNieOBruODnuODhuODquOCouODq+OBruaZgumWk+abtOaWsFxuICAgICAgICB0aGlzLmdyYXNzTWF0ZXJpYWwudW5pZm9ybXMudGltZS52YWx1ZSA9IHRpbWU7XG5cbiAgICAgICAgdGhpcy5jb250cm9scy51cGRhdGUoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICAgIH1cbn1cblxuLy8g44K344O844OzXG5uZXcgU2FrdXJhU2NlbmUoKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX3RocmVlX2V4YW1wbGVzX2pzbV9jb250cm9sc19PcmJpdENvbnRyb2xzX2pzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9