angular.module('labrynthVR').factory('AlphaSceneFactory', [
  function() {
    'use strict';
    console.log('Alpha Scene created');

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

    var uniforms1 = {
      time: {
        type: 'f',
        value: 1.0
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2()
      }
    };

    var material = new THREE.ShaderMaterial({
      uniforms: uniforms1,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragment_shader4').textContent
    });

    var createSphere = function() {
      //sphere.add($scope.camera);
      var sphere = new Physijs.SphereMesh(
        new THREE.SphereGeometry(5, 16, 16),
        material
      );

      sphere.position.z = -14;
      sphere.receiveShadow = true;
      sphere.castShadow = true;
      sphere.collisions = 0;
      sphere.__dirtyPosition = true;
      return sphere;
    };

    var sphere = createSphere();
    scene.add(sphere);

    var goal = new Physijs.BoxMesh(
      new THREE.CubeGeometry(5, 5, 5),
      red
    );

    goal.position.z = 14;
    goal.position.y = -14;
    goal.receiveShadow = true;
    goal.castShadow = true;

    var goalCollison = function(collidedWith) {// linearVelocity, angularVelocity
      if (collidedWith.uuid === sphere.uuid) {
        alert('you win.');
      }
    };

    goal.addEventListener('collision', goalCollison);

    goal.collisions = 1;

    scene.add(goal);

    var lights = [
      {
        color: 0x4040ff,
        seeds: {
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        }
      }, //001
      {
        color: 0x40ff40,
        seeds: {
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        }
      }, //010
      {
        color: 0x40ffff,
        seeds: {
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        }
      }, //011
      {
        color: 0xff4040,
        seeds: {
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        }
      }, //100
      {
        color: 0xff40ff,
        seeds: {
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        }
      }, //101
      {
        color: 0xffff00,
        seeds: {
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        }
      }, //110
      {
        color: 0xffffff,
        seeds: {
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        }
      }  //111
    ];

    var makeFlies = function(lights) {
      var flies = [];

      for (var i = lights.length - 1; i >= 0; i--) {
        var spot = new THREE.PointLight(lights[i].color);
        spot.position.z = (Math.random() * 5) - 2.5;
        spot.position.x = (Math.random() * 5) - 2.5;
        spot.position.y = (Math.random() * 5) - 2.5;

        var mesh = new THREE.Mesh(geometry, red);
        mesh.scale.x = 0.2;
        mesh.scale.y = 0.2;
        mesh.scale.z = 0.2;
        flies.push({
          spot:spot,
          mesh: mesh,
          color:lights[i].color,
          seeds:lights[i].seeds
        });
        scene.add(spot);
        scene.add(mesh);
      }
      return flies;
    };

    var flies = makeFlies(lights);

    camera.rotation.x = -0.4;

    var clock = new THREE.Clock();
    /*
    Handle window resizes
    */

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      effect.setSize(window.innerWidth, window.innerHeight);
    }

    var worldRenderLoop = function() {

      var delta = clock.getDelta();

      uniforms1.time.value += delta * 5;

      sphere.__dirtyPosition = true;

      for (var i = 0; i <  flies.length; i++) {
        var light = flies[i].spot;
        var mesh = flies[i].mesh;
        var max = 1000;
        var now = Date.now();
        var seeds = flies[i].seeds;

        var x = (max * noise.perlin2(now / 1000, seeds.x)) - (max / 2);
        light.position.x = x;
        mesh.position.x = x;

        var y = max + (max * noise.perlin2(now / 1000, seeds.y)) - (max / 2);
        light.position.y = y;
        mesh.position.y = y;

        var z = (max * noise.perlin2(now / 1000, seeds.z)) - (max / 2);
        light.position.z = z;
        mesh.position.z = z;

      }
    };
    scene.camera = camera;
    scene.renderLoop = worldRenderLoop;

    return scene;
  }]);
