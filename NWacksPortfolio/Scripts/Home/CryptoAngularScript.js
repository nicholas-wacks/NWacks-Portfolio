//Handle Angular table
function initializeAngular(cryptoObj) {
    //Define the module
    var cryptoApp = angular.module('cryptoApp', []);

    //Define the controller on the module
    cryptoApp.controller('CryptoController', function CryptoController($scope) {
        $scope.currencies = cryptoObj;
        $scope.page = 1;
        $scope.recordsPerPage = 10;
        $scope.sortValue = 'rank';

        //Allows the ceil method to be used for determining max pages
        $scope.ceiling = function (value) {
            return Math.ceil(value);
        }

        $scope.setSortValue = function (value) {
            if ($scope.sortValue == value)
                $scope.sortValue = '-' + value;
            else
                $scope.sortValue = value;
        }
    });
}