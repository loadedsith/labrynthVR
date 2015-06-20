angular.module('labrynthVR')
  .controller('MainCtrl', ['$scope', 'SceneService',
  function($scope, SceneService) {
    'use strict';
    $scope.scene = SceneService.getScene('welcome');

    $scope.$on('start',function () {
      console.log('broadcast workse');
      $scope.scene = SceneService.getScene('alpha');

    });
  }]);
