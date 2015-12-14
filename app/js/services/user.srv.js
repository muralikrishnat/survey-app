//COde for login service
angular.module('pollingApp').service('UserService', function () {
    var currentUser=null;
    this.set = function (userObject) {
        currentUser = userObject;
    }

    this.get = function () {
        return currentUser;
    }
});
