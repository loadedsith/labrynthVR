angular.module('labrynthVR').service('SceneService', [
  'AlphaSceneFactory',
  'WelcomeSceneFactory',
  function(AlphaScene, WelcomeScene) {
    'use strict';
    console.log('Scene Service');
    this.getScene = function(sceneName) {
      console.log('getScene', sceneName);
      if (sceneName === 'alpha') {
        return AlphaScene;
      }
      return WelcomeScene;
    };
  }]);
