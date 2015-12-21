angular.module('pollingApp').controller('HomePageController', function ($scope, $rootScope, firebasedb) {
    $scope.ActiveQuestions = [];

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

    $rootScope.$on('question-list', function (e, d) {
        $scope.safeApply(function () {
            $scope.ActiveQuestions = d;
        });
    });
});
