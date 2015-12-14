angular.module('pollingApp').controller('RegisterController', function ($scope, $rootScope, firebasedb) {
    $scope.RegisterSignUp = function () {
        var registerObject = {};
        registerObject.UserName = $scope.UserName;
        registerObject.Password = $scope.Password;
        registerObject.Email = $scope.Email;

        console.log(registerObject);
        firebasedb.Users.registerUser(registerObject).then(function (registeredUser) {
                console.log('User added succesfull');
            },
            function (err) {
                //code for registration Failure
                console.log('Registration failed');
            });
    };
});
