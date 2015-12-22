var firebaseModule = angular.module('firebase-db-module', []);

firebaseModule.provider('firebasedb', function () {
    var DbRef = null;
    var DbRefUrl = null;
    var FireBaseUsersUrl = '/appdata/users';
    var FireBaseQuestionsUrl = '/appdata/questions';
    var FireBaseAnswersUrl = '/appdata/answers';
    var FireBaseQuestionAnswerUrl = '/appdata/questionanswers';
    var FireBaseUserQuestionAnswerUrl = '/appdata/userquestionanswers';
    var events = {};

    var UsersList = [];
    var QuestionsList = [];
    var AnswersList = [], answersLoaded = false;
    var QuestionAnswersList = [], questionanswersLoaded = false;
    var UserQuestionAnswersList = [];

    var generateUUID = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    var UserClass = function (u, r) {
        this.UserName = u['UserName'];
        this.Password = u['Password'];
        this.Email = u['Email'];
        this.Type = u['Type'] || 'User';
        this.Guid = u['Guid'] || generateUUID();
        this.Ref = r ? new Firebase(r) : '';
    };

    var QuestionClass = function (q, r) {
        this.Text = q["Text"];
        this.Type = q["Type"] || 'YesNo';
        this.Guid = q["Guid"] || generateUUID();
        this.AddedBy = q["AddedBy"];
        this.AddedOn = q["AddedOn"] || (new Date()).getTime();

        this.Ref = r ? new Firebase(r) : null;
        this.Options = q["Options"] || [];
    };


    var AnswerClass = function (m, r) {
        this.Text = m['Text'];
        this.Guid = m['Guid'] || generateUUID();

        this.Ref = r ? new Firebase(r) : null;
    };

    var QuestionAnswerClass = function (m, r) {
        this.Guid = m['Guid'] || generateUUID();

        this.QuestionGuid = m['QuestionGuid'];
        this.AnswerGuid = m['AnswerGuid'];
        this.Order = m['Order'];

        this.Ref = r ? new Firebase(r) : null;
    };

    var UserQuestionAnswerMappingClass = function (m, r) {
        this.Guid = m['Guid'] || generateUUID();
        this.QuestionGuid = m['QuestionGuid'];
        //this is Array,need to store list of answers which are selected by User
        this.AnswerGuids = m['AnswerGuids'];
        this.UserGuid = m['UserGuid'];
        this.AnsweredOn = m['AnsweredOn'];
        this.Ref = r ? new Firebase(r) : null;
    };


    var convertModelToFirebase = function (modelData) {
        var fireBaseData = {};
        if (modelData) {
            Object.keys(modelData).forEach(function (p) {
                if (p == 'Ref' || p == 'Options') {

                } else {
                    fireBaseData[p] = modelData[p];
                }
            });
        }
        return fireBaseData;
    };

    var convertFirebaseToModel = function (modelType, fireBaseData) {
        var modelList = [];
        if (fireBaseData && Object.keys(fireBaseData).length > 0) {
            Object.keys(fireBaseData).forEach(function (dataKey) {
                var dataObject = fireBaseData[dataKey];
                var objectToPush = null;
                if (modelType.toUpperCase() == 'User'.toUpperCase()) {
                    objectToPush = new UserClass(dataObject, DbRefUrl + FireBaseUsersUrl + '/' + dataKey)
                } else if (modelType.toUpperCase() == 'Question'.toUpperCase()) {
                    objectToPush = new QuestionClass(dataObject, DbRefUrl + FireBaseQuestionsUrl + '/' + dataKey)
                } else if (modelType.toUpperCase() == 'Answer'.toUpperCase()) {
                    objectToPush = new AnswerClass(dataObject, DbRefUrl + FireBaseAnswersUrl + '/' + dataKey)
                }else if (modelType.toUpperCase() == 'QuestionAnswer'.toUpperCase()) {
                    objectToPush = new QuestionAnswerClass(dataObject, DbRefUrl + FireBaseQuestionAnswerUrl + '/' + dataKey)
                }else if (modelType.toUpperCase() == 'UserQuestionAnswer'.toUpperCase()) {
                    objectToPush = new UserQuestionAnswerMappingClass(dataObject, DbRefUrl + FireBaseUserQuestionAnswerUrl + '/' + dataKey)
                }

                if (objectToPush) {
                    modelList.push(objectToPush);
                }

            });
        }

        return modelList;
    };


    var getDefaultAnswers = function (listOfAnswers) {
        var defaultAnswers = [];
        _.forEach(listOfAnswers, function (answerItem) {
            if(answerItem.Text.toUpperCase() == 'Yes'.toUpperCase() || answerItem.Text.toUpperCase() == 'No'.toUpperCase()) {
                defaultAnswers.push(answerItem);
            }
        });
        return defaultAnswers;
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
        var QuestionsRef = new Firebase(DbRefUrl + FireBaseQuestionsUrl);
        var AnswersRef = new Firebase(DbRefUrl + FireBaseAnswersUrl);
        var QuestionAnswersRef = new Firebase(DbRefUrl + FireBaseQuestionAnswerUrl);
        var UserQuestionAnswersRef = new Firebase(DbRefUrl + FireBaseUserQuestionAnswerUrl);


        var serviceObject = {};

        var awaitForAnswersFn = [];
        var resolveFn = null;

        var getOptionsForQuestions = function (qList) {
            var promises = [];
            if(qList.length > 0) {
                for (var i = 0; i < qList.length; i++) {
                    promises.push(new Promise(function (resolve0level, reject0level) {
                        var questionToGetOptions = qList[i];
                        serviceObject.Questions.OptionsForQuestion(qList[i]).then(function (opts) {
                            questionToGetOptions.Options = opts;
                            resolve0level(opts);
                        });
                    }));
                }
            }else{
                promises.push(new Promise(function (resolve, reject) {
                    resolve([]);
                }));
            }
            return promises;
        };


        UsersRef.on('value', function (ss) {
            var fireBaseData = ss.val();
            if (fireBaseData) {
                UsersList = convertFirebaseToModel('User', fireBaseData);
                $rootScope.$emit('user-list', UsersList);
            }
        });

        QuestionsRef.on('value', function (ss) {
            var fireBaseData = ss.val();
            if (fireBaseData) {
                QuestionsList = convertFirebaseToModel('Question', fireBaseData);
                AnswersRef.once('value', function (aa) {
                    var fireBaseData = aa.val();
                    if (fireBaseData) {
                        AnswersList = convertFirebaseToModel('Answer', fireBaseData);
                        answersLoaded = true;
                    }
                    Promise.all(getOptionsForQuestions(QuestionsList)).then(function(g){
                        console.log('After getting all the options for questions ', g);
                        $rootScope.$emit('question-list', QuestionsList);
                    });
                });
            }
        });

        AnswersRef.on('value', function (ss) {
            var fireBaseData = ss.val();
            if (fireBaseData) {
                AnswersList = convertFirebaseToModel('Answer', fireBaseData);
                answersLoaded = true;
            }
        });

        QuestionAnswersRef.on('value', function (ss) {
            var fireBaseData = ss.val();
            if (fireBaseData) {
                QuestionAnswersList = convertFirebaseToModel('QuestionAnswer', fireBaseData);
                questionanswersLoaded = true;
                //$rootScope.$emit('answer-list', AnswersList);
            }
        });

        UserQuestionAnswersRef.on('value', function (ss) {
            var fireBaseData = ss.val();
            if (fireBaseData) {
                QuestionAnswersList = convertFirebaseToModel('UserQuestionAnswer', fireBaseData);
                //$rootScope.$emit('answer-list', AnswersList);
            }
        });





        var UserServiceClass = function () {

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
                    UsersRef.push(new UserClass(registerObject), function (err) {
                        if (!err) {
                            resolve(registerObject);
                        } else {
                            reject(err);
                        }
                    });
                });

            };
        };
        serviceObject.Users = new UserServiceClass();

        var QuestionServiceClass = function () {
            this.List = function (questionObject) {
                return new Promise(function (resolve, reject) {
                    QuestionsRef.once('value', function (ss) {
                        var firebaseData = ss.val();
                        if (firebaseData) {
                            var questions = convertFirebaseToModel('Question', firebaseData);
                            var filteredQuestions = questions;
                            if (questionObject) {
                                filteredQuestions = _.filter(questions, function (filterItem) {
                                    return (filterItem.Guid === questionObject.Guid);
                                });
                            }
                            AnswersRef.once('value', function (aa) {
                                var fireBaseData = aa.val();
                                if (fireBaseData) {
                                    AnswersList = convertFirebaseToModel('Answer', fireBaseData);
                                    answersLoaded = true;
                                }
                                Promise.all(getOptionsForQuestions(filteredQuestions)).then(function(g){
                                    console.log('After getting all the options for questions ', g);
                                    resolve(filteredQuestions);
                                });
                            });


                        } else {
                            resolve([]);
                        }
                    }, function (err) {
                        resolve([]);
                    });

                });
            };

            this.OptionsForQuestion = function (questionObject) {
                return new Promise(function (resolve0level, reject0level) {
                    if(questionObject){
                        if(questionObject.Type == 'YesNo'){
                            if(answersLoaded && AnswersList.length > 0){
                                resolve0level(getDefaultAnswers(AnswersList));
                            }else{
                                console.warn("Answers are not available in Server for question");
                                resolve0level([]);
                            }
                        }
                    }else{
                        if(answersLoaded && AnswersList.length > 0){
                            resolve0level(getDefaultAnswers(AnswersList));
                        }else{
                            console.warn("Answers are not available in Server");
                            resolve0level([]);
                        }
                    }
                });
            };

            this.Update = function (questionObject, isDelete) {
                return new Promise(function (resolve, reject) {
                    if (!questionObject.Ref && !questionObject.Guid) {
                        var questionToAdd = new QuestionClass(questionObject);
                        QuestionsRef.push(questionToAdd, function (err) {
                            if (!err) {
                                serviceObject.Answers.List().then(function(d){
                                    if(d.length > 0){
                                        var defaultAnswersList = getDefaultAnswers(d);
                                        var questionAnswerToAdd1 = new QuestionAnswerClass({ "QuestionGuid": questionToAdd.Guid, "AnswerGuid": defaultAnswersList[0].Guid, "Order": 1 });
                                        var questionAnswerToAdd2 = new QuestionAnswerClass({ "QuestionGuid": questionToAdd.Guid, "AnswerGuid": defaultAnswersList[1].Guid, "Order": 2 });
                                        var waitingForPromise = 2;
                                        QuestionAnswersRef.push(questionAnswerToAdd1, function (err) {
                                            waitingForPromise = waitingForPromise - 1;
                                            if(waitingForPromise == 0){
                                                resolve({"ExeStatus": "SUCCESS", "OptionsAdded": true});
                                            }
                                        });

                                        QuestionAnswersRef.push(questionAnswerToAdd2, function (err) {
                                            waitingForPromise = waitingForPromise - 1;
                                            if(waitingForPromise == 0){
                                                resolve({"ExeStatus": "SUCCESS", "OptionsAdded": true});
                                            }
                                        });
                                    }else{
                                        resolve({"ExeStatus": "SUCCESS", "OptionsAdded": false});
                                    }
                                });
                                //QuestionAnswersRef.push();


                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        });
                    } else if (questionObject.Ref && questionObject.Guid && isDelete) {
                        questionObject.Ref.remove(function (err) {
                            if (!err) {
                                serviceObject.QuestionAnswers.List().then(function (qnaList) {
                                    for(var i = 0; i < qnaList.length ; i++){
                                        if(qnaList.QuestionGuid === questionObject.Guid) {
                                            qnaList[i].Ref.remove();
                                        }
                                    }
                                });
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        })
                    } else if (questionObject.Ref && questionObject.Guid && !isDelete) {
                        questionObject.Ref.update(convertModelToFirebase(questionObject), function (err) {
                            if (!err) {
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        });
                    } else {
                        resolve({"ExeStatus": "SUCCESS"});
                    }
                });
            };

            this.FilterBy = function (filterObject) {
                return new Promise(function (resolve, reject) {
                    if (filterObject.By == 'User') {
                        //QuestionsRef.once('value', function (ss) {
                        //    var firebaseData = ss.val();
                        //    if (firebaseData) {
                        //        var questions = convertFirebaseToModel('Question', firebaseData);
                        //        var filteredQuestions = questions;
                        //        if (questionObject) {
                        //            filteredQuestions = _.filter(questions, function (filterItem) {
                        //                return (filterItem.Guid === questionObject.Guid);
                        //            })
                        //        }
                        //        resolve(filteredQuestions);
                        //    } else {
                        //        resolve([]);
                        //    }
                        //}, function (err) {
                        //    resolve([]);
                        //});
                    }

                    resolve([]);
                });
            };

        };
        serviceObject.Questions = new QuestionServiceClass();

        var AnswerServiceClass = function () {

            this.List = function (answerObject, qObject) {
                return new Promise(function (resolve, reject) {
                    AnswersRef.once('value', function (ss) {
                        var firebaseData = ss.val();
                        if (firebaseData) {
                            var answers = convertFirebaseToModel('Answer', firebaseData);
                            var filteredAnswers = answers;
                            resolve(filteredAnswers);
                        } else {
                            resolve([]);
                        }
                    }, function (err) {
                        resolve([]);
                    });

                });
            };

            this.Update = function (answerObject, isDelete) {
                return new Promise(function (resolve, reject) {
                    if (!answerObject.Ref && !answerObject.Guid) {
                        AnswersRef.push(new AnswerClass(answerObject), function (err) {
                            if (!err) {
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        });
                    } else if (answerObject.Ref && answerObject.Guid && isDelete) {
                        AnswersRef.Ref.remove(function (err) {
                            if (!err) {
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        })
                    } else if (answerObject.Ref && answerObject.Guid && !isDelete) {
                        AnswersRef.Ref.update(convertModelToFirebase(answerObject), function (err) {
                            if (!err) {
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        });
                    } else {
                        resolve({"ExeStatus": "SUCCESS"});
                    }
                });
            };
        };
        serviceObject.Answers = new AnswerServiceClass();


        var QuestionAnswerServiceClass = function () {

            this.List = function (qnaObject, qObject) {
                return new Promise(function (resolve, reject) {
                    QuestionAnswersRef.once('value', function (ss) {
                        var firebaseData = ss.val();
                        if (firebaseData) {
                            var questionanswers = convertFirebaseToModel('QuestionAnswer', firebaseData);
                            var filteredLists = questionanswers;
                            if(questionanswers.length > 0){

                            }else{

                            }
                            resolve(filteredLists);
                        } else {
                            resolve([]);
                        }
                    }, function (err) {
                        resolve([]);
                    });

                });
            };

            this.Update = function (qnsanswerObject, isDelete) {
                return new Promise(function (resolve, reject) {
                    if (!qnsanswerObject.Ref && !qnsanswerObject.Guid) {
                        QuestionAnswersRef.push(new QuestionAnswerClass(qnsanswerObject), function (err) {
                            if (!err) {
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        });
                    } else if (qnsanswerObject.Ref && qnsanswerObject.Guid && isDelete) {
                        QuestionAnswersRef.Ref.remove(function (err) {
                            if (!err) {
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        })
                    } else if (qnsanswerObject.Ref && qnsanswerObject.Guid && !isDelete) {
                        QuestionAnswersRef.Ref.update(convertModelToFirebase(qnsanswerObject), function (err) {
                            if (!err) {
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        });
                    } else {
                        resolve({"ExeStatus": "SUCCESS"});
                    }
                });
            };
        };
        serviceObject.QuestionAnswers = new QuestionAnswerServiceClass();


        var UserQuestionAnswerServiceClass = function () {

            this.List = function (uqnaObject) {
                return new Promise(function (resolve, reject) {
                    UserQuestionAnswersRef.once('value', function (ss) {
                        var firebaseData = ss.val();
                        if (firebaseData) {
                            var questionanswers = convertFirebaseToModel('UserQuestionAnswer', firebaseData);
                            var filteredLists = questionanswers;
                            if(questionanswers.length > 0){

                            }else{

                            }
                            resolve(filteredLists);
                        } else {
                            resolve([]);
                        }
                    }, function (err) {
                        resolve([]);
                    });

                });
            };

            this.Update = function (uqnaObject, isDelete) {
                return new Promise(function (resolve, reject) {
                    if (!uqnaObject.Ref && !uqnaObject.Guid) {
                        UserQuestionAnswersRef.push(new UserQuestionAnswerServiceClass(uqnaObject), function (err) {
                            if (!err) {
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        });
                    } else if (uqnaObject.Ref && uqnaObject.Guid && isDelete) {
                        UserQuestionAnswersRef.Ref.remove(function (err) {
                            if (!err) {
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        })
                    } else if (uqnaObject.Ref && uqnaObject.Guid && !isDelete) {
                        UserQuestionAnswersRef.Ref.update(convertModelToFirebase(uqnaObject), function (err) {
                            if (!err) {
                                resolve({"ExeStatus": "SUCCESS"});
                            } else {
                                resolve({"ExeStatus": "FAIL"});
                            }
                        });
                    } else {
                        resolve({"ExeStatus": "SUCCESS"});
                    }
                });
            };
        };
        serviceObject.UserQuestionAnswers = new UserQuestionAnswerServiceClass();

        return serviceObject;
    };
});