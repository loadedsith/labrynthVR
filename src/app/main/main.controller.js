angular.module('labrynthVR')
  .controller('MainCtrl', ['$scope', 'SceneService',
  function($scope, SceneService) {
    'use strict';
    $scope.scene = SceneService.getScene();
  }]);
