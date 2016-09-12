(function() {
  'use strict';

  angular
    .module('app')
    .controller('SuccessCtrl', SuccessCtrl);

  SuccessCtrl.$inject = ['$scope', 'socket'];

  function SuccessCtrl($scope, socket) {
  };
})();