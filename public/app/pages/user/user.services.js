
( function () {
    angular.module('user').service('userService', [ '$q', 'apiService', function ($q, apiService) {

        var userService = {};

        var getUsers = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/user/getAllUsers/' + parameters.offset + '/' + parameters.limit, parameters).then(function (response) {
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

        var changeUserStatus = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/user/updateUserStatus', parameters).then(function (response) {
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

        var viewUser = function (parameters) {
            var deferred = $q.defer();
            apiService.get('admin/user/getUserDetails/' + parameters).then(function (response) {
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


        userService.getUsers = getUsers;
        userService.viewUser = viewUser;
        userService.changeUserStatus = changeUserStatus;

        return userService;

    } ]);
} )();