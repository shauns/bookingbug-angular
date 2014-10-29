

bbAdminDirectives = angular.module('BBAdmin.Directives', []);

bbAdminDirectives.controller('CalController', function($scope) {
    /* config object */
    $scope.calendarConfig = {
        height: 450,
        editiable: true,
        dayClick: function(){
            scope.$apply($scope.alertEventOnClick);
        }
    };
});
