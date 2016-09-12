(function() {
  'use strict';

  angular
    .module('app')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope','socket','$timeout'];



  function LoginCtrl($scope,  socket, $timeout) {

    $scope.timer ={max:30,enabled:false};

    $scope.pushEnabled=false;


    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.isValidEmail =function() {
      return re.test($scope.email);
    };

    $scope.activatePush = function(){
      $scope.pushEnabled =true;
      $scope.timer.enabled=true;
      $scope.timer.current=30;
      $scope.waitForAction();
      socket.emit('join', {
        type: 'requester',
        name: 'bibin@gmail.com'//$scope.email
      });
    }

//cancel-request
  socket.on('cancel-request', function(data) {
      $scope.cancelPush(true);
      
    });
    $scope.cancelPush = function(noEmit){
      $scope.pushEnabled =false;
      $scope.timer.enabled=false;
      $scope.timer.current=0;
      if(!noEmit){
      socket.emit('cancel', {
        type: 'requester',
        name: 'bibin@gmail.com'
      });
      }
    };

    var timer;

    $scope.waitForAction = function(){
      if($scope.timer.current==0){
        $timeout.cancel(timer);
        $scope.cancelPush();
        return;
      }
      $scope.timer.current--;
      timer = $timeout($scope.waitForAction, 1000)
    }

 

  };
})();
