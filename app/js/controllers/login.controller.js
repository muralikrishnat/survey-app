angular.module('pollingApp').controller('LoginController', function ($scope,firebasedb,UserService, $cookieStore, $rootScope, $location){
    //$scope.message = 'This is login screen';
    //Code for displaying the entered login details in console
    $scope.LoginBtn = function () {
        var Login = {};
        Login.Email = $scope.LoginEmail;
        Login.Password = $scope.LoginPassword;
        firebasedb.Users.authenticateUser(Login).then(function(registeredUser){
            if(registeredUser){
                UserService.set(registeredUser);

                //storing in cookieStore..., we can also use sessionStorage,localStorage
                $cookieStore.put('User-Guid', registeredUser.Guid);
                //navigating to home after succesfull login
                //we have to call before $apply b'coz $location is also a scope in application level and comes under $rootScope so
                //by calling $apply will effect $location,$cookieStore
                //this approach is very effective if there are many things to do in one time without effecting others while doing these changes
                $location.path('/home');

                //As mention in above lines we just call '$apply' once after changing all things.
                // '$apply' will inform angular app to do needed work like updating view, document.cookie,route change
                //calling $apply to get effect added cookies to browser cookies
                //and will take to home page on change of the $location.path
                //TODO: use safe apply If there is any problem with $apply() ,for now $apply will serve our needs
                $rootScope.$apply();


                //storing in local Storage
                //localStorage.setItem('User-Guid', JSON.stringify(registeredUser.Guid));


            }
            else{
                //TODO: code for displaying login failed msgs
                console.log('login failed');
            }
        });
    };
});
