'use strict';


function SpaceMonitorCtrl($scope,  $location) {
  


  $scope.$on("Add_Space", function(event, message){
     console.log("got new space", message)
     $scope.$apply();
   });




}

SpaceMonitorCtrl.$inject = ['$scope', '$location', 'CompanyService'];
