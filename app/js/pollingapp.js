var pollingApp = angular.module('pollingApp', ['ngRoute', 'ngResource']);
pollingApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/questions', {templateUrl: 'pages/questions.html', controller: 'QuestionsController'})
        .when('/reports', {templateUrl: 'pages/reports.html', controller: 'ReportsController'})
        .when('/userslist', {templateUrl: 'pages/userslist.html', controller: 'UsersListController'})
        .when('/login', {templateUrl: 'pages/login.html', controller: 'LoginController'})
        .when('/register', {templateUrl: 'pages/register.html', controller: 'RegisterController'})
        .otherwise({redirectTo: '/login'});
}]);
pollingApp.controller('QuestionsController', function ($scope) {
    //$scope.message='This is Questions screen';
    // jQuery('#myBtn').click(function(){
    //               jQuery('.modal-popup').removeClass('collapse');
    //               });

    $scope.todoList = [{todoText: 'Basic Question', done: false}];
    $scope.addQuestion = function () {
        $scope.todoList.push({todoText: $scope.todoInput, done: false});
        $scope.todoInput = "";
    };

    // $scope.remove = function() {
    //     var oldList = $scope.todoList;
    //     $scope.todoList = [];
    //     angular.forEach(oldList, function(x) {
    //         if (!x.done) $scope.todoList.push(x);
    //     });
    // };
});
pollingApp.controller('ReportsController', function ($scope) {
    $scope.message = 'This is reports screen';
});
pollingApp.controller('UsersListController', function ($scope) {
    $scope.message = 'This is userslist screen';
});
pollingApp.controller('LoginController', function ($scope) {
    $scope.message = 'This is login screen';
});
pollingApp.controller('RegisterController', function ($scope) {
    $scope.message = 'This is Register screen';
    jQuery('#signup-btn').click(function () {
        console.log(jQuery('#usernamesignup').val());
        console.log(jQuery('#emailsignup').val());
        console.log(jQuery('#passwordsignup').val());
        console.log(jQuery('#passwordsignup_confirm').val());
    });

});

// pollingApp.filter('searchFor',function(){
//   			return function(arr,searchString){
// 		 		if(!searchString){
// 		 			return arr;
// 		 		}
// 		 		var result=[];
// 		 		searchString=searchString.toLowerCase();
// 		 		angular.forEach(arr,function(item){
// 		 			if(item.title.toLowerCase().indexOf(searchString)!==-1){
// 		 				result.push(item);
// 		 			}
// 		 		});
// 		 		return result;
// 		 	};
//   		});
//   			 function QuestionsController($scope){
// 		 	$scope.items=[
// 		 	{
// 		 		url:'http://tutorialzine.com/2013/07/50-must-have-plugins-for-extending-twitter-bootstrap/',
// 		 		title:'50 Must-have plugins for extending Twitter Bootstrap',
// 		 		image:'http://cdn.tutorialzine.com/wp-content/uploads/2013/07/featured_4-100x100.jpg'
// 		 	},
// 		 	{
// 			url: 'http://tutorialzine.com/2013/08/simple-registration-system-php-mysql/',
// 			title: 'Making a Super Simple Registration System With PHP and MySQL',
// 			image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/08/simple_registration_system-100x100.jpg'
// 		},
// 		{
// 			url: 'http://tutorialzine.com/2013/08/slideout-footer-css/',
// 			title: 'Create a slide-out footer with this neat z-index trick',
// 			image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/08/slide-out-footer-100x100.jpg'
// 		},
// 		{
// 			url: 'http://tutorialzine.com/2013/06/digital-clock/',
// 			title: 'How to Make a Digital Clock with jQuery and CSS3',
// 			image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/06/digital_clock-100x100.jpg'
// 		},
// 		{
// 			url: 'http://tutorialzine.com/2013/05/diagonal-fade-gallery/',
// 			title: 'Smooth Diagonal Fade Gallery with CSS3 Transitions',
// 			image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/05/featured-100x100.jpg'
// 		},
// 		{
// 			url: 'http://tutorialzine.com/2013/05/mini-ajax-file-upload-form/',
// 			title: 'Mini AJAX File Upload Form',
// 			image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/05/ajax-file-upload-form-100x100.jpg'
// 		},
// 		{
// 			url: 'http://tutorialzine.com/2013/04/services-chooser-backbone-js/',
// 			title: 'Your First Backbone.js App – Service Chooser',
// 			image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/04/service_chooser_form-100x100.jpg'
// 		}
// 	];
//  }
