var pollingApp = angular.module('pollingApp', ['ngRoute', 'ngResource', 'firebase-db-module', 'ngCookies']);
pollingApp.config(['$routeProvider', 'firebasedbProvider', function ($routeProvider, firebasedbProvider) {
    $routeProvider
        .when('/home', {templateUrl: 'pages/homepage.html', controller: 'HomePageController'})
        .when('/questions', {templateUrl: 'pages/questions.html', controller: 'QuestionsController'})
        .when('/reports', {templateUrl: 'pages/reports.html', controller: 'ReportsController'})
        .when('/userslist', {templateUrl: 'pages/userslist.html', controller: 'UsersListController'})
        .when('/login', {templateUrl: 'pages/login.html', controller: 'LoginController'})
        .when('/register', {templateUrl: 'pages/register.html', controller: 'RegisterController'})
        .when('/graphs', {templateUrl: 'pages/graphs.html', controller: 'GraphsController'})
        .otherwise({redirectTo: '/home'});

    firebasedbProvider.config({Url: 'https://nimbu-polling.firebaseio.com'});
}]);
