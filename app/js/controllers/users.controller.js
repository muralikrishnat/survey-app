angular.module('pollingApp').controller('UsersListController', function ($scope, $rootScope, firebasedb) {
    $scope.message = 'This is userslist screen';
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
    // this code is for getting users whenever we make call
    firebasedb.Users.List().then(function (users) {
          $scope.safeApply(function () {
            $scope.Users = users; 
        });
        console.log(users);
    });

    // to get whenever there is userlist changed in firebase DB
    // below event will execute and print the list on console
    $rootScope.$on('user-list', function (e, d) {
        $scope.Users = d;
        $scope.$apply();
    });
});
