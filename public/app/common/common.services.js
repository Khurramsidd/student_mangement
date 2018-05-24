
( function () {
    angular.module('BlurAdmin.pages').service('GlobalServices', GlobalServices);

    GlobalServices.$inject = [ '$q', 'apiService', '$state' ];

    function GlobalServices ($q, apiService) {

        var GlobalServices = {};

        var currentUser = function () {
            var deferred = $q.defer();
            apiService.get('admin/currentAccount', {}).then(function (response) {
                    if ( response )
                        deferred.resolve(response);
                    else
                        deferred.reject('Something went wrong while processing your request. Please Contact Administrator.');
                },
                function (reject) {
                    console.log(reject);
                    deferred.reject(reject);
                });
            return deferred.promise;
        };

        var blockUser = function (parameters) {
            var deferred = $q.defer();
            apiService.get('admin/generic/blockUser/' + parameters.id, {}).then(function (response) {
                    if ( response )
                        deferred.resolve(response);
                    else
                        deferred.reject('Something went wrong while processing your request. Please Contact Administrator.');
                },
                function (reject) {
                    console.log(reject);
                    deferred.reject(reject);
                });
            return deferred.promise;
        };

        var unBlockUser = function (parameters) {
            var deferred = $q.defer();
            apiService.get('admin/generic/unBlockUser/' + parameters.id, {}).then(function (response) {
                    if ( response )
                        deferred.resolve(response);
                    else
                        deferred.reject('Something went wrong while processing your request. Please Contact Administrator.');
                },
                function (reject) {
                    console.log(reject);
                    deferred.reject(reject);
                });
            return deferred.promise;
        };

        GlobalServices.currentUser = currentUser;
        GlobalServices.blockUser = blockUser;
        GlobalServices.unBlockUser = unBlockUser;

        return GlobalServices;
    }
} )();