angular.module('pollingApp').controller('UsersListController', function ($scope, $rootScope, firebasedb) {
    $scope.message = 'This is userslist screen';
    // this code is for getting users whenever we make call
    firebasedb.Users.List().then(function (users) {
        $scope.Users = users;
        $scope.$apply();

        console.log(users);
    });

    // to get whenever there is userlist changed in firebase DB
    // below event will execute and print the list on console
    $rootScope.$on('user-list', function (e, d) {
        $scope.Users = d;
        $scope.$apply();
    });
});
