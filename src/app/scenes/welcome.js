angular.module('labrynthVR').factory('WelcomeSceneFactory', [
  '$rootScope',
  function($rootScope) {
    'use strict';
    console.log('Welcome Scene created');

    var noise = new Noise(Math.random());
    Physijs.scripts.worker = '/vendor/physijs_worker.js';
    Physijs.scripts.ammo = '/vendor/ammo.js';

    var scene = new Physijs.Scene({fixedTimeStep: 1 / 120});

    scene.addEventListener(
      'update',
      function() {
        scene.simulate(undefined, 1);
      }
    );
    var windowAspectRatio = window.innerWidth / window.innerHeight;

    var camera = new THREE.PerspectiveCamera(75, windowAspectRatio, 0.01, 100);
    camera.position.set(0, 10, 50);

    var geometry = new THREE.CubeGeometry(3, 3, 3);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    var red = new THREE.MeshPhongMaterial({color: 0xff0000});
    var shininess = 50;
    var specular = 0x333333;
    var shading = THREE.SmoothShading;

    var green = new THREE.MeshPhongMaterial({color: 0x445511});
    var gold = new THREE.MeshPhongMaterial({
      metal: true,
      color: 0xffd700,
      specular: specular,
      shininess: shininess,
      shading: shading
    });

    var buildWall = function(config, scene) {
      var geometry = config.geometry || new THREE.CubeGeometry(3, 3, 3);
      var color = config.color || new THREE.MeshPhongMaterial({
        color: 0xff0000
      });
      var wall = new Physijs.BoxMesh(geometry, color , 0);

      wall.position.y = config.position.y || 0;
      wall.position.x = config.position.x || 0;
      wall.position.z = config.position.z || 0;

      wall.receiveShadow = config.receiveShadow || true;
      wall.castShadow = config.castShadow || true;

      wall.renderDepth = 1;

      wall.scale.x = config.scale.x || 1;
      wall.scale.y = config.scale.y || 1;
      wall.scale.z = config.scale.z || 1;
      if (scene.clickable === undefined) {
        scene.clickable = [];
      }
      scene.clickable.push(wall);

      scene.add(wall);
    };

    var makeWalls = function() {

      var groundLevel = -20;
      var wallLength = 27;

      var ground = {
        color: green,
        geometery: geometry,
        position:{
          x: 0,
          y: groundLevel - 18,
          z: 0
        },
        scale:{
          x: 40,
          y: 1,
          z: 40
        }
      };

      var forward = {
        color:green,
        position:{
          x:0,
          y:groundLevel,
          z:-40
        },
        scale:{
          x:wallLength,
          y:10,
          z:1
        }
      };

      var backward = {
        color:green,
        position:{
          x:0,
          y:groundLevel,
          z:40
        },
        scale:{
          x:wallLength,
          y:10,
          z:1
        }
      };

      var right = {
        position: {
          x: 40,
          y: groundLevel,
          z: 0
        },
        scale: {
          x: 1,
          y: 10,
          z: wallLength
        }
      };

      var left = {
        color: gold,
        position: {
          x: -40,
          y: groundLevel,
          z: 0
        },
        scale: {
          x: 1,
          y: 10,
          z: wallLength
        }
      };

      var walls = [
        forward,
        backward,
        left,
        right,
        ground
      ];

      for (var i = walls.length - 1; i >= 0; i--) {
        buildWall(walls[i], scene);
      }
    };
    makeWalls();

    camera.rotation.x = -0.4;

    var clock = new THREE.Clock();
    /*
    Handle window resizes
    */
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onWindowResize, false);

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    var worldRenderLoop = function() {
      //var delta = clock.getDelta();
    };
    $rootScope.$broadcast('start', true);

    scene.camera = camera;
    scene.renderLoop = worldRenderLoop;

    return scene;
  }]);
