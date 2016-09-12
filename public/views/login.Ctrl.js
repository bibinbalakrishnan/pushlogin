(function() {
  'use strict';

  angular
    .module('app')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope','socket','$location','$http'];



  function LoginCtrl($scope,socket,$location,$http) {

    $scope.timer ={max:30,enabled:false};

    $scope.pushEnabled=false;


    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.isValidEmail =function() {
      return re.test($scope.email);
    };

    $scope.login= function(){
      console.log("Invoking login...")
      var data = {username: $scope.email, password: $scope.pass};
      $http.post("/api/login", data).then(function(res){
        if(res.data && res.data.auth=="success"){
          $location.path('/success');
        }
    });
    }

    $scope.activatePush = function(){
      $scope.pushEnabled =true;
      $scope.timer.enabled=true;
      $scope.timer.current=30;
      //$scope.waitForAction();
      socket.emit('join', {
        type: 'requester',
        name: 'bibin@gmail.com'//$scope.email
      });
    }

//cancel-request
  socket.on('countdown',function(data){
      $scope.timer.current = data;
      if($scope.timer.current==0){
        $scope.cancelPush();
      }
  });

  socket.on('auth-success',function(data){
      console.log(data.token);

  });

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

   
 

  };
})();
