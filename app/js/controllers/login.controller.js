angular.module('pollingApp').controller('LoginController', function ($scope,firebasedb,UserService, $cookieStore){
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
                $cookieStore.put('User-Guid', registeredUser.Guid);
            }
            else{
                console.log('login failed');
            }
        });
    };
});
