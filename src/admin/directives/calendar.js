

angular.module('BBAdmin.Directives').controller('CalController', function($scope) {
    /* config object */
    $scope.calendarConfig = {
        height: 450,
        editiable: true,
        dayClick: function(){
            scope.$apply($scope.alertEventOnClick);
        }
    };
});
