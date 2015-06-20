angular.module('labrynthVR').service('vrService',
  ['$rootScope', '$timeout',
  function() {
    'use strict';

    console.log('VR Service');

    var _this = this;

    _this.getHMDVRDevice = function(vrdevs) {
      for (var i = 0; i < vrdevs.length; ++i) {
        if (vrdevs[i] instanceof HMDVRDevice) {
          return vrdevs[i];
        }
      }
    };

    _this.getHMDSensor = function(vrdevs, vrHMD) {
      for (var i = 0; i < vrdevs.length; ++i) {
        var isPositionSensor = vrdevs[i] instanceof PositionSensorVRDevice;
        var sameDevice = vrdevs[i].hardwareUnitId === vrHMD.hardwareUnitId;
        if (isPositionSensor && sameDevice) {
          return vrdevs[i];
        }
      }
    };

    return _this;
  }]);
