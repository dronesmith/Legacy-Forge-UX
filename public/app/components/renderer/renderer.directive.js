'use strict';

angular
  .module('ForgeApp')
	.directive('renderer', function () {
			return {
				restrict: "E",
				scope: {
					bind: "=bind"
				},
				link: function (scope, elem, attr) {
					var camera;
					var scene;
					var renderer;
					var previous;

					// init scene
					init();

					var loader1 = new THREE.STLLoader();
          var mesh;

					// scope.$watch("bind", function(newValue, oldValue) {
					// 	if (newValue != oldValue) {
          //     scope.bind = newValue;
          //   }
					// });

					function loadModel(modelUrl) {

             loader1.load(modelUrl, function(geometry) {
               if (geometry.hasColors) {
                 material = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: THREE.VertexColors });
                 mesh = new THREE.Mesh( geometry, material );
               } else {
                  mesh = new THREE.Mesh( geometry);
               }
               scene.add(mesh);
             });

						// loader1.load(modelUrl, function (assimpjson) {
						// 	assimpjson.scale.x = assimpjson.scale.y = assimpjson.scale.z = 0.2;
						// 	assimpjson.updateMatrix();
						// 	if (previous) scene.remove(previous);
						// 	scene.add(assimpjson);
            //
						// 	previous = assimpjson;
						// });
					}

					loadModel("assets/models/ktoolcor.stl");
					animate();

					function init() {
            // Init camera
						camera = new THREE.PerspectiveCamera(50, 320 / 240, 1, 2000);
						camera.position.set(2, 4, 5);

            // Init scene
						scene = new THREE.Scene();
						scene.fog = new THREE.FogExp2(0x000000, 0.035);

						// Lights
						scene.add(new THREE.AmbientLight(0xcccccc));
						var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee);
						directionalLight.position.x = Math.random() - 0.5;
						directionalLight.position.y = Math.random() - 0.5;
						directionalLight.position.z = Math.random() - 0.5;
						directionalLight.position.normalize();
						scene.add(directionalLight);

						// Renderer
						renderer = new THREE.WebGLRenderer();
						renderer.setSize(320, 240);
						elem[0].appendChild(renderer.domElement);

						// Events
						window.addEventListener('resize', onWindowResize, false);
					}

					//
					function onWindowResize(event) {
						// renderer.setSize(window.innerWidth, window.innerHeight);
						// camera.aspect = window.innerWidth / window.innerHeight;
						// camera.updateProjectionMatrix();
					}

					//
					var t = 0;

					function animate() {
						requestAnimationFrame(animate);
						render();
					}

					//
					function render() {
            if (scope.bind) {
              mesh.rotation.x = scope.bind['ATTITUDE'].yaw * (180 / 3.14159);
				      mesh.rotation.y = scope.bind['ATTITUDE'].pitch * (180 / 3.14159);
              mesh.rotation.z = scope.bind['ATTITUDE'].roll * (180 / 3.14159)
            }
						// var timer = Date.now() * 0.0005;
						// camera.position.x = Math.cos(timer) * 10;
						// camera.position.y = 4;
						// camera.position.z = Math.sin(timer) * 10;
						camera.lookAt(scene.position);
						renderer.render(scene, camera);
					}
				}
			}
		}
	)
;
