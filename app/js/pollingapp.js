var pollingApp = angular.module('pollingApp', ['ngRoute', 'ngResource', 'firebase-db-module']);
pollingApp.config(['$routeProvider', 'firebasedbProvider', function ($routeProvider, firebasedbProvider) {
    $routeProvider
        .when('/home', {templateUrl: 'pages/homepage.html', controller: 'HomePageController'})
        .when('/questions', {templateUrl: 'pages/questions.html', controller: 'QuestionsController'})
        .when('/reports', {templateUrl: 'pages/reports.html', controller: 'ReportsController'})
        .when('/userslist', {templateUrl: 'pages/userslist.html', controller: 'UsersListController'})
        .when('/login', {templateUrl: 'pages/login.html', controller: 'LoginController'})
        .when('/register', {templateUrl: 'pages/register.html', controller: 'RegisterController'})
        .otherwise({redirectTo: '/home'});

    firebasedbProvider.config({Url: 'https://nimbu-polling.firebaseio.com'});


}]);

pollingApp.controller('HomePageController', function ($scope) {
    $scope.ActiveQuestions = [];
});


//Code for Questions page
pollingApp.service('ProfileService', function () {

    var uid = 1;
    var details = [{
        id: 0,
        'question': 'How are you?',
        'description': 'I hope everything is fine!'
    }];
    this.save = function (detail) {
        if (detail.id == null) {
            detail.id = uid++;
            details.push(detail);
        }
        else {
            for (i in details) {
                if (details[i].id == detail.id) {
                    details[i] = detail;
                }
            }
        }
    }
    this.get = function (id) {
        for (i in details) {
            if (details[i].id == id) {
                return details[i];
            }
        }
    }
    this.delete = function (id) {
        for (i in details) {
            if (details[i].id == id) {
                details.splice(i, 1);
            }
        }
    }
    this.list = function () {
        return details;
    }
});

pollingApp.controller('QuestionsController', function ($scope, ProfileService) {
    $scope.details = ProfileService.list();
    $scope.saveQuestion = function () {
        ProfileService.save($scope.newquestion);
        $scope.newquestion = {};
    }
    $scope.delete = function (id) {
        ProfileService.delete(id);
        if ($scope.newquestion.id == id)
            $scope.newquestion = {};
    }
    $scope.edit = function (id) {
        $scope.newquestion = angular.copy(ProfileService.get(id));
    }
})

//End of code
pollingApp.controller('ReportsController', function ($scope) {
    //$scope.message = 'This is reports screen';
    $scope.items = [
        {
            question: 'How are you?',
            answeredBy: 'Nipuna',
            selectedAnswer: 'yes'
        },
        {
            question: 'Is everything fine?',
            answeredBy: 'Nisha',
            selectedAnswer: 'yes'
        }
    ];
});

pollingApp.controller('UsersListController', function ($scope) {
    $scope.message = 'This is userslist screen';
});

pollingApp.controller('LoginController', function ($scope) {
    //$scope.message = 'This is login screen';
    //Code for displaying the entered login details in console
    $scope.LoginBtn = function () {
        var Login = {};
        Login.Email = jQuery('#inputEmail').val();
        Login.Pwd = jQuery('#inputPassword').val();
        console.log(Login);
    };
});
//Code for displaying the entered registered users in console
pollingApp.controller('RegisterController', function ($scope) {
    $scope.RegisterSignUp = function () {
        var Register = {};
        Register.Username = jQuery('#usernamesignup').val();
        Register.EmailSignUp = jQuery('#emailsignup').val();
        Register.PasswordSignUp = jQuery('#passwordsignup').val();
        Register.PwdSignupConfirm = jQuery('#passwordsignup_confirm').val();

        console.log(Register);
    };
});
