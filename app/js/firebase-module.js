var firebaseModule = angular.module('firebase-db-module', []);

firebaseModule.provider('firebasedb', function () {
    var DbRef = null;
    var DbRefUrl = null;
    var FireBaseUsersUrl = '/appdata/users';
    var events = {};

    var generateUUID = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    var UserClass = function (u, p, e, g, r) {
        this.UserName = u;
        this.Password = p;
        this.Email = e;
        this.Guid = g || generateUUID();
        this.Ref = r || '';
    };

    var convertFirebaseToModel = function (modelType, fireBaseData) {
        var modelList = [];
        if(modelType.toUpperCase() == 'User'.toUpperCase()){
            if (Object.keys(fireBaseData).length > 0) {
                Object.keys(fireBaseData).forEach(function (userkey) {
                    var user = fireBaseData[userkey];
                    var userRef = new Firebase(DbRefUrl + FireBaseUsersUrl + '/' + userkey);
                    modelList.push(new UserClass(user.UserName, user.Password, user.Email, user.Guid, userRef));
                });
            }
        }
        return modelList;
    };

    this.config = function (config) {
        if (window.Firebase) {
            DbRefUrl = config.Url;
            DbRef = new Firebase(config.Url || 'https://nimbu-polling.firebaseio.com');
        }

    };
    this.$get = function ($rootScope) {
        var rootTHIS = this;

        var UsersRef = new Firebase(DbRefUrl + FireBaseUsersUrl);
        var UsersList = [];

        UsersRef.on('value', function (ss) {
            var fireBaseData = ss.val();
            UsersList = convertFirebaseToModel('User', fireBaseData);
            $rootScope.$emit('user-list', UsersList);
        });


        var serviceObject = {};

        var UsersClass = function () {

            this.List = function () {
                return new Promise(function (resolve, reject) {
                    UsersRef.once('value', function (ss) {
                        var fireBaseData = ss.val();
                        var users = convertFirebaseToModel('User', fireBaseData);
                        resolve(users);
                    }, function (err) {
                        resolve([]);
                    });
                });
            };

            this.authenticateUser = function (loginObject) {
                return new Promise(function (resolve, reject) {
                    UsersRef.once('value', function (ss) {
                        var fireBaseData = ss.val();
                        var users = convertFirebaseToModel('User', fireBaseData);
                        var filteredItems = _.filter(users, function (filterItem) {
                            if (((filterItem.UserName && filterItem.UserName == loginObject.Email) || (filterItem.Email && filterItem.Email == loginObject.Email)) && filterItem.Password == loginObject.Password) {
                                return true;
                            }
                            return false;
                        });
                        if (filteredItems.length > 0) {
                            resolve(filteredItems[0]);
                        } else {
                            resolve(null);
                        }
                    }, function (err) {
                        resolve(null);
                    });
                });

            };

            this.registerUser = function (registerObject) {
                return new Promise(function (resolve, reject) {
                    UsersRef.push(new UserClass(registerObject.UserName, registerObject.Password, registerObject.Email), function (err) {
                        if (!err) {
                            resolve(registerObject);
                        } else {
                            reject(err);
                        }
                    });
                });

            };
        };
        serviceObject.Users = new UsersClass();


        return serviceObject;
    };
});
