var firebaseModule = angular.module('firebase-db-module', []);

firebaseModule.provider('firebasedb', function () {
    this.FirebaseConfig = {};
    this.DbRef = null;
    this.config = function (config) {
        this.FirebaseConfig.Url = config.Url;
        if(window.Firebase){
            this.DbRef = new Firebase(this.FirebaseConfig.Url || 'https://nimbu-polling.firebaseio.com');
        }

    };
    this.$get = function () {
        var rootTHIS = this;
        var serviceObject = function () {
            this.Name = 'Firebase DB Service';

            this.Users = function () {
                return new Promise(function (resolve, reject) {
                    //rootTHIS.DbRef.child().on('value', function (val) {
                    //
                    //});
                    resolve([{"Name":"Murali"}]);
                });
            };
        };
        return new serviceObject();
    };
});
