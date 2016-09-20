(function () {
    'use strict';

    angular
        .module('app')
        .controller('SuccessCtrl', SuccessCtrl);

    SuccessCtrl.$inject = ['$scope', 'socket','$location'];

    function SuccessCtrl($scope, socket,$location) {
      $scope.push = $location.search()['push'];
      console.log($scope.push);
    };
})();