angular.module('pollingApp').controller('LogoutController', function ($scope, firebasedb,$location) {
	console.log('logged out');
	$scope.logout=function(){
	 Session.clear();
	 $location.path('/home');
    }
});