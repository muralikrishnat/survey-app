angular.module('pollingApp').controller('QuestionsController', function ($scope, firebasedb, $rootScope, UserService, $cookieStore) {

    //code for hiding questions on buttonclick
    $scope.myVar = false;
    $scope.addQuestion = function () {
        $scope.myVar = !$scope.myVar;
    };


    //code that uses for angular $apply error
    //forget about below function that is only for fixing $apply error
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


    //As we navigate to and for  other Pages 'question-list' listener will  not not show at that time
    //to handle such scenarios we need some thing like this...which will get Questions instantly whenever we come from some other page
    //TODO: Need more sophisticated way to show existing Questions on coming from other page
    firebasedb.Questions.List().then(function (d) {
        $scope.safeApply(function () {
            $scope.questions = d;
        });
    });



    //here 'question-list' is event name which is already declared in firebasedb service
    //for handling list we have to listen to this event, b'coz we are handling respective events in firebase db service
    //to avoid unneccesaary event listening in controller...in future we can change firebase db service not the controller
    //controller code remains same for whatever db we use....
    $rootScope.$on('question-list', function (e, d) {
        //this code will execute whenever there is a change in the questions list
        $scope.safeApply(function () {
            //binding the listener data to questions scope variable
            $scope.questions = d;
        });
    });

    //code for saving question to firebase db
    $scope.saveQuestion = function () {
        //As of now , we are using angular cookie to store user guid
        //which is using as user reference to question(who added this question kind of details)
        //Note : we are setting this cookie value while user logged into the app
        var userGuid = $cookieStore.get('User-Guid');
        if(userGuid && userGuid.replace(/ /g,'').length > 0) {
            firebasedb.Questions.Update({
                'Text': $scope.newquestion.question,
                'AddedBy': userGuid
            }).then(function (Questions) {
                $scope.newquestion.question = '';
            });
        }

    };

    $scope.delete = function (question) {
        // removing of question is now handled by firebase service
        // b'coz on removal of question we have to remove respective options.
        firebasedb.Questions.Update(question, true).then(function (exeStatus) {
            console.log('Deletion status', exeStatus);
        });
    };

});
