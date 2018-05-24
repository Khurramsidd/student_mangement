/**
 * Created by Majid on 1/10/2018.
 */
( function () {
    angular.module('services').service('servicesServices', [ '$q', 'apiService', function ($q, apiService) {

        var categoriesServices = {};

        var getServices = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/tasks/getTasks/' + parameters.offset + '/' + parameters.limit, parameters).then(function (response) {
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

        var addService = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/tasks/add', parameters).then(function (response) {
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

        var editService = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/tasks/edit', parameters).then(function (response) {
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

        var getCategories = function () {
            var deferred = $q.defer();
            apiService.get('admin/tasks/getCategories').then(function (response) {
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

        categoriesServices.getServices = getServices;
        categoriesServices.addService = addService;
        categoriesServices.editService = editService;
        categoriesServices.getCategories = getCategories;

        return categoriesServices;

    } ]);

} )();