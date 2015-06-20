angular.module('labrynthVR').service('SceneService', ['AlphaSceneFactory',
  function(AlphaScene) {
    'use strict';
    console.log('Scene Service');
    this.getScene = function() {
      return AlphaScene;
    };
  }]);
