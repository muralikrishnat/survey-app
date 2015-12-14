var firebaseModule = angular.module('firebase-db-module', []);

firebaseModule.provider('firebasedb', function () {
    var DbRef = null;
    var DbRefUrl = null;
    var FireBaseUsersUrl = '/appdata/users';
    var FireBaseQuestionssUrl = '/appdata/questions';
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
        this.Options = [];
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


    var convertModelToFirebase = function (modelData) {
        var fireBaseData = {};
        if(modelData) {
            Object.keys(modelData).forEach(function (p) {
                if (p == 'Ref' || p == 'Options'){

                }else {
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
                    objectToPush = new QuestionClass(dataObject, DbRefUrl + FireBaseQuestionssUrl + '/' + dataKey)
                }

                if (objectToPush) {
                    modelList.push(objectToPush);
                }

            });
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
        var QuestionsRef = new Firebase(DbRefUrl + FireBaseQuestionssUrl);

        var UsersList = [];
        var QuestionsList = [];

        UsersRef.on('value', function (ss) {
            var fireBaseData = ss.val();
            if(fireBaseData) {
                UsersList = convertFirebaseToModel('User', fireBaseData);
                $rootScope.$emit('user-list', UsersList);
            }
        });

        QuestionsRef.on('value', function (ss) {
            var fireBaseData = ss.val();
            if(fireBaseData) {
                QuestionsList = convertFirebaseToModel('Question', fireBaseData);
                $rootScope.$emit('question-list', QuestionsList);
            }
        });

        var serviceObject = {};

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
                        if(firebaseData) {
                            var questions = convertFirebaseToModel('Question', firebaseData);
                            var filteredQuestions = questions;
                            if (questionObject) {
                                filteredQuestions = _.filter(questions, function (filterItem) {
                                    return (filterItem.Guid === questionObject.Guid);
                                })
                            }
                            resolve(filteredQuestions);
                        }else{
                            resolve([]);
                        }
                    }, function (err) {
                        resolve([]);
                    });

                });
            };

            this.Update = function (questionObject, isDelete) {
                return new Promise(function (resolve, reject) {
                    if(!questionObject.Ref && !questionObject.Guid) {
                        QuestionsRef.push(new QuestionClass(questionObject), function (err) {
                            if(!err){
                                resolve({"ExeStatus": "SUCCESS"});
                            }else{
                                resolve({"ExeStatus": "FAIL"});
                            }
                        });
                    }else if(questionObject.Ref && questionObject.Guid && isDelete){
                        questionObject.Ref.remove(function (err) {
                            if(!err){
                                resolve({"ExeStatus": "SUCCESS"});
                            }else{
                                resolve({"ExeStatus": "FAIL"});
                            }
                        })
                    }else if(questionObject.Ref && questionObject.Guid && !isDelete){
                        questionObject.Ref.update(convertModelToFirebase(questionObject), function (err) {
                            if(!err){
                                resolve({"ExeStatus": "SUCCESS"});
                            }else{
                                resolve({"ExeStatus": "FAIL"});
                            }
                        });
                    }else{
                        resolve({"ExeStatus": "SUCCESS"});
                    }
                });
            };

            this.FilterBy = function (filterObject) {
                return new Promise(function (resolve, reject) {
                    if (filterObject.By == 'User') {
                        resolve([]);
                    }
                });
            };

        };
        serviceObject.Questions = new QuestionServiceClass();




        return serviceObject;
    };
});
