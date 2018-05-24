( function () {
    angular.module('login').service('loginService', [ '$q', 'apiService', function ($q, apiService) {

        var loginService = {};

        var authenticateUser = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/logIn', parameters).then(function (response) {
                    if ( response )
                        deferred.resolve(response);
                    else
                        deferred.reject('Something went wrong while processing your request. Please Contact Administrator.');
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        loginService.authenticateUser = authenticateUser;

        return loginService;

    } ]);

    angular.module('login').service('logOutService', [ '$q', 'apiService', function ($q, apiService) {

        var logOutService = {};

        var logOutUser = function () {
            var deferred = $q.defer();
            apiService.get('admin/logOut', {}).then(function (response) {
                    if ( response )
                        deferred.resolve(response);
                    else
                        deferred.reject('Something went wrong while processing your request. Please Contact Administrator.');
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        logOutService.logOutUser = logOutUser;

        return logOutService;

    } ]);
} )();