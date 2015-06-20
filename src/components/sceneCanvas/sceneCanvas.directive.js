'use strict';

angular.module('labrynthVR')
  .directive('sceneCanvas', ['vrService', function(vrService) {
    return {
      restrict: 'E',

      scope:{
        scene: '='
      },

      template: '<canvas class="scene-canvas"></canvas>',

      link: function(scope, element) {


        var camera = scope.camera;
        var renderer = new THREE.WebGLRenderer({
          canvas:element[0].childNodes[0],
          antialias: true
        });

        var gravity = new THREE.Quaternion();
        renderer.setSize(window.innerWidth - 0, window.innerHeight - 0);

        /*
        Apply VR stereo rendering to renderer
        */
        var effect = new THREE.VREffect(renderer);
        effect.setSize(window.innerWidth, window.innerHeight);

        renderer.autoClear = false;
        renderer.setClearColor(0x404040);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        var controls = new THREE.VRControls(camera);
        var manager;
        if (navigator.getVRDevices) {
          manager = new WebVRManager(renderer, effect);
        }

        var vrHMD;
        var vrHMDSensor;
        if (navigator.getVRDevices !== undefined) {
          navigator.getVRDevices().then(function(vrdevs) {
            vrHMD = vrService.getHMDVRDevice(vrdevs);
            vrHMDSensor = vrService.getHMDSensor(vrdevs, vrHMD);
          });
        }

        function render() {
          if (vrHMDSensor !== undefined) {
            var orientation = vrHMDSensor.getState().orientation;
            if (orientation !== undefined && orientation !== null) {
              gravity.set(
                orientation.x,
                orientation.y,
                orientation.z,
                orientation.w
              );
              scope.gravity = new THREE.Euler();
              scope.gravity.setFromQuaternion(gravity, 'XYZ');
              var max = 15;
              var offset = 0.0 * max;
              scene.setGravity(new THREE.Vector3(
                gravity.z * max - offset, //left and right
                -30,
                -1 * (gravity.x * max - offset)//Fore and back
              ));
            }
          }

          /*
          Update VR headset position and apply to camera.
          */
          controls.update();
          /*
          Render the scene through the VREffect.
          */
          requestAnimationFrame(render);

          if (manager && manager.isVRMode()) {
            effect.render(scope.scene, scope.scene.camera);
          } else {

            renderer.render(scope.scene, scope.scene.camera);
          }
          if (typeof scope.scene.renderLoop === 'function') {
            scope.scene.renderLoop();
          }
          scope.scene.simulate(); // run physics
        }

        render();
        /*
        Listen for double click event to enter full-screen VR mode
        */
        document.body.addEventListener('dblclick', function() {
          effect.setFullScreen(true);
        });

        /*
        Listen for keyboard event and zero positional sensor on appropriate keypress.
        */
        function onkey(event) {
          event.preventDefault();

          if (event.keyCode === 90) {// z
            controls.zeroSensor();
          }
        }

        window.addEventListener('keydown', onkey, true);

      }
    };
  }]);
