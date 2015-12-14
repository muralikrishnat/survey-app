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

        firebasedb.Questions.Update({
            'Text': $scope.newquestion.question,
            'AddedBy': userGuid
        }).then(function (Questions) {
            $scope.newquestion.question = '';
        });

    };

    $scope.delete = function (question) {
        //Here question object is coming from html under part of ng-click function
        //whenever user clicks on delete/deactivate button then this $scope.delete method call with question object
        //in that question object 'Ref' property is there to refer firebase reference
        //we can remove the question by using that 'Ref' as we are using in-build method to remove question
        question.Ref.remove(function(err){
            //As firebase is two way connection
            // web <==> firebase db
            //for eg., we are using the firebaseRef.on('value',...)
            //if we use 'on' that function will execute whenever there is a change in firebase db
            if(!err) {

                console.log('deletion of question successfully done');
            }
        });
    };

});
