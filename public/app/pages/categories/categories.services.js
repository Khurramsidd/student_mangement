/**
 * Created by Majid on 1/10/2018.
 */
( function () {
    angular.module('categories').service('categoriesServices', [ '$q', 'apiService', function ($q, apiService) {

        var categoriesServices = {};

        var getCategories = function (parameters) {
            console.log(parameters)
            var deferred = $q.defer();
            apiService.create('admin/categories/getCategories/' + parameters.offset + '/' + parameters.limit, parameters).then(function (response) {
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

        var addCategory = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/categories/add', parameters).then(function (response) {
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

        var editCategory = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/categories/edit', parameters).then(function (response) {
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

        categoriesServices.getCategories = getCategories;
        categoriesServices.addCategory = addCategory;
        categoriesServices.editCategory = editCategory;

        return categoriesServices;

    } ]);

} )();