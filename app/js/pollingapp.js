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
        'type': 'I hope everything is fine!'
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
     
//code for hiding questions on buttonclick 
    $scope.myVar = false;
    $scope.addQuestion = function() {
        $scope.myVar = !$scope.myVar;
    };

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
    // $scope.edit = function (id) {
    //     $scope.newquestion = angular.copy(ProfileService.get(id));
    // }

     // firebasedb.Users.List().then(function(){       
     //            console.log('Question added succesfull');
     // });
});

//End of code
pollingApp.controller('ReportsController', function ($scope) {
    //$scope.message = 'This is reports screen';
    // $scope.items = [
    //     {
    //         question: 'How are you?',
    //         answeredBy: 'Nipuna',
    //         selectedAnswer: 'yes'
    //     },
    //     {
    //         question: 'Is everything fine?',
    //         answeredBy: 'Nisha',
    //         selectedAnswer: 'yes'
    //     }
    // ];
});

pollingApp.controller('UsersListController', function ($scope, $rootScope, firebasedb) {
    $scope.message = 'This is userslist screen';
     // this code is for getting users whenever we make call
                    firebasedb.Users.List().then(function(users){
                        $scope.Users = users;
                        $scope.$apply();

                        console.log(users);
                    });

                    // to get whenever there is userlist changed in firebase DB
                    // below event will execute and print the list on console
                    $rootScope.$on('user-list', function(e, d){
                       $scope.Users = d;
                       $scope.$apply();
                    });
});


//COde for login service
pollingApp.service('UserService', function () {
    var currentUser=null;
     this.set = function (userObject) {
        currentUser = userObject;
    }

    this.get = function () {
         return currentUser;
    }
});

pollingApp.controller('LoginController', function ($scope,firebasedb,UserService){
    //$scope.message = 'This is login screen';
    //Code for displaying the entered login details in console
    $scope.LoginBtn = function () {
        var Login = {};
        Login.Email = $scope.LoginEmail;
        Login.Password = $scope.LoginPassword;
        console.log(Login);
        firebasedb.Users.authenticateUser(Login).then(function(registeredUser){
            if(registeredUser){
                console.log('login succesfull');
                UserService.set(registeredUser);
            }
            else{
                console.log('login failed');
            }
       });
    };
});
//Code for displaying the entered registered users in console
pollingApp.controller('RegisterController', function ($scope, $rootScope, firebasedb) {
    $scope.RegisterSignUp = function () {
        var registerObject  = {};
        registerObject.UserName = $scope.UserName;
        registerObject.Password = $scope.Password;
        registerObject.Email = $scope.Email; 

        console.log(registerObject);
        firebasedb.Users.registerUser(registerObject).then(function(registeredUser){
            console.log('User added succesfull');
       },
         function(err){
                        //code for registration Failure
                        console.log('Registration failed');
          });
    };
});


  //Code for google maps

   // Load the Visualization API and the piechart package.
      // google.load('visualization', '1.0', {'packages':['corechart']});

      // // Set a callback to run when the Google Visualization API is loaded.
      // google.setOnLoadCallback(drawChart);

      // // Callback that creates and populates a data table,
      // // instantiates the pie chart, passes in the data and
      // // draws it.
      // function drawChart() {

      //   // Create the data table.
      //   var data = new google.visualization.DataTable();
      //   data.addColumn('string', 'Topping');
      //   data.addColumn('number', 'Slices');
      //   data.addRows([
      //     ['Questions', 3],
      //     ['No.of persons answered', 1] 
      //   ]);

      //   // Set chart options
      //   var options = {'title':'No.of Persons answered same question',
      //                  'width':400,
      //                  'height':300};

      //   // Instantiate and draw our chart, passing in some options.
      //   var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      //   chart.draw(data, options);
      // }