angular.module('pollingApp').directive('navHeader', function () {
    return {
        restrict: 'E',
        templateUrl: 'pages/partials/header.html',
        controller: function ($scope, $cookieStore, $rootScope) {

            //code for avoiding $digest error
            //we are writing in every controller b'coz to avoid application level safe
            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };


            //code used for checking cookie and setting 'IsLoginUser' scope variable true or false
            //declaring in function to be used again..re usable goes as functions
            var checkLogin = function () {
                $scope.IsLoginUser = false;
                if($cookieStore.get('User-Guid')){
                    $scope.IsLoginUser = true;
                }
            };

            //calling above funciton to check user cookie...
            // we have to check user on page load
            checkLogin();

            //method used for logout logic..on user logout frst we are made user-guid cookie empty
            //And emiting/calling the event to do rest of actions like...changing the html,document.cookie
            //As that emiter listener is declared in below
            $scope.Logout = function () {
                $cookieStore.put('User-Guid');
                $rootScope.$emit('user-changed');
            };

            //started listening the 'user-changed' event...will be used to share data between controllers/directives
            //will invoke whenever user perform 'login' or 'logout' actions
            //it simply checks the user cookie and do html update
            $rootScope.$on('user-changed', function () {
                $scope.safeApply(checkLogin);
            });

        }
    };
});
