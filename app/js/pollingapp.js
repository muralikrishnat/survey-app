
var pollingApp = angular.module('pollingApp', ['ngRoute', 'ngResource', 'firebase-db-module']);
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

pollingApp.controller('HomePageController', function ($scope) {
    $scope.ActiveQuestions = [];
});


//Code for Questions page
// pollingApp.service('ProfileService', function () {

//     var uid = 1;
//     var details = [{
//         id: 0,
//         'question': 'How are you?',
//         'type': 'I hope everything is fine!'
//     }];
//     this.save = function (detail) {
//         if (detail.id == null) {
//             detail.id = uid++;
//             details.push(detail);
//         }
//         else {
//             for (i in details) {
//                 if (details[i].id == detail.id) {
//                     details[i] = detail;
//                 }
//             }
//         }
//     }
//     this.get = function (id) {
//         for (i in details) {
//             if (details[i].id == id) {
//                 return details[i];
//             }
//         }
//     }
//     this.delete = function (id) {
//         for (i in details) {
//             if (details[i].id == id) {
//                 details.splice(i, 1);
//             }
//         }
//     }
//     this.list = function () {
//         return details;
//     }
// });

pollingApp.controller('QuestionsController', function ($scope, firebasedb,$rootScope,UserService) {
     
//code for hiding questions on buttonclick 
    $scope.myVar = false;
    $scope.addQuestion = function() {
        $scope.myVar = !$scope.myVar;
    };

    
    $rootScope.$on('question-list', function(e, d){
                       
                       $scope.details = d;
                       $scope.$apply();
                    });
    $scope.saveQuestion = function () {
        var user= UserService.get();

         firebasedb.Questions.Update({'Text':$scope.newquestion.question, 'AddedBy':user.Guid}).then(function(Questions){
                 $scope.newquestion.question = '';
         });
       
    }
    $scope.delete = function (id) {
        ProfileService.delete(id);
        if ($scope.newquestion.id == id)
            $scope.newquestion = {};
    }
    
});

//End of code
pollingApp.controller('ReportsController', function ($scope) {
     
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

//  google.setOnLoadCallback(function () {
//     angular.bootstrap(document.body, ['pollingApp']);
// });
// google.load('visualization', '1', {
//     packages: ['corechart']
// });
 
// pollingApp.directive('pieChart', function ($timeout) {
//     return {
//         restrict: 'EA',
//         scope: {
//             title: '@title',
//             width: '@width',
//             height: '@height',
//             data: '=data',
//             selectFn: '&select'
//         },
//         link: function ($scope, $elm, $attr) {

//             // Create the data table and instantiate the chart
//             var data = new google.visualization.DataTable();
//             data.addColumn('string', 'Label');
//             data.addColumn('number', 'Value');
//             var chart = new google.visualization.PieChart($elm[0]);

//             draw();

//             // Watches, to refresh the chart when its data, title or dimensions change
//             $scope.$watch('data', function () {
//                 draw();
//             }, true); // true is for deep object equality checking
//             $scope.$watch('title', function () {
//                 draw();
//             });
//             $scope.$watch('width', function () {
//                 draw();
//             });
//             $scope.$watch('height', function () {
//                 draw();
//             });

//             // Chart selection handler
//             google.visualization.events.addListener(chart, 'select', function () {
//                 var selectedItem = chart.getSelection()[0];
//                 if (selectedItem) {
//                     $scope.$apply(function () {
//                         $scope.selectFn({
//                             selectedRowIndex: selectedItem.row
//                         });
//                     });
//                 }
//             });

//             function draw() {
//                 if (!draw.triggered) {
//                     draw.triggered = true;
//                     $timeout(function () {
//                         draw.triggered = false;
//                         var label, value;
//                         data.removeRows(0, data.getNumberOfRows());
//                         angular.forEach($scope.data, function (row) {
//                             label = row[0];
//                             value = parseFloat(row[1], 10);
//                             if (!isNaN(value)) {
//                                 data.addRow([row[0], value]);
//                             }
//                         });
//                         var options = {
//                             'title': $scope.title,
//                                 'width': $scope.width,
//                                 'height': $scope.height
//                         };
//                         chart.draw(data, options);
//                         // No raw selected
//                         $scope.selectFn({
//                             selectedRowIndex: undefined
//                         });
//                     }, 0, true);
//                 }
//             }
//         }
//     };
// });

// pollingApp.controller('GraphsController', function ($scope) {
//     // Initial chart data
//     $scope.chartTitle = "Lead Sources";
//     $scope.chartWidth = 500;
//     $scope.chartHeight = 320;
//     $scope.chartData = [
//         ['Ad Flyers', 11],
//         ['Web (Organic)', 4],
//         ['Web (PPC)', 4],
//         ['Yellow Pages', 7],
//         ['Showroom', 3]
//     ];

//     $scope.deleteRow = function (index) {
//         $scope.chartData.splice(index, 1);
//     };
//     $scope.addRow = function () {
//         $scope.chartData.push([]);
//     };
//     $scope.selectRow = function (index) {
//         $scope.selected = index;
//     };
//     $scope.rowClass = function (index) {
//         return ($scope.selected === index) ? "selected" : "";
//     };
// });

     