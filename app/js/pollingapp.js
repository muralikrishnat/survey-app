
$(document).ready(function () {
    $(".navbar-toggle").click(function () {
        $(".navbar-collapse").toggle(function () {
            $(this).removeClass("collapse");
        });
    });
});

var sampleApp = angular.module('sampleApp', ['ngRoute', 'ngResource']);
sampleApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/questions', {templateUrl: 'pages/questions.html', controller: 'QuestionsController'})
        .when('/reports', {templateUrl: 'pages/reports.html', controller: 'ReportsController'})
        .when('/userslist', {templateUrl: 'pages/userslist.html', controller: 'UsersListController'})
        .when('/login', {templateUrl: 'pages/login.html', controller: 'LoginController'})
        .when('/register', {templateUrl: 'pages/register.html', controller: 'RegisterController'})
        .otherwise({redirectTo: '/login'});

}]);
sampleApp.controller('QuestionsController', function ($scope) {
    $scope.message = 'This is Questions screen';
});
sampleApp.controller('ReportsController', function ($scope) {
    $scope.message = 'This is reports screen';
});
sampleApp.controller('UsersListController', function ($scope) {
    $scope.message = 'This is userslist screen';
});
sampleApp.controller('LoginController', function ($scope) {
    $scope.message = 'This is login screen';
});
sampleApp.controller('RegisterController', function ($scope) {
    $scope.message = 'This is Register screen';
});
		

