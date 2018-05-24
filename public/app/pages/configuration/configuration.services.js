/**
 * Created by Bilal on 01/22/2018.
 */
(function () {
    angular.module('configuration').service('configurationService', ['$q', 'apiService', function ($q, apiService) {

        var configurationService = {};

        var getRates = function () {
            var deferred = $q.defer();
            apiService.get('admin/rate/').then(function (response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject('Something went wrong while processing your request. Please Contact Administrator.');
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var updateRate = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/rate/update', parameters).then(function (response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject('Something went wrong while processing your request. Please Contact Administrator.');
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        configurationService.getRates = getRates;
        configurationService.updateRate = updateRate;

        return configurationService;

    }]);
})();