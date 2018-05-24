/**
 * Created by Raza on 8/1/2017.
 */
( function () {
    angular.module('sp').service('spService', [ '$q', 'apiService', function ($q, apiService) {

        var spService = {};

        var getAllSp = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/sp/getAllSp/' + parameters.offset + '/' + parameters.limit, parameters).then(function (response) {
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
        var viewSp = function (parameters) {
            var deferred = $q.defer();
            apiService.get('admin/sp/getSpDetails/' + parameters.id).then(function (response) {
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
        var changeSpStatus = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/sp/updateSpStatus', parameters).then(function (response) {
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


        var verifyCategoryService = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/sp/updateSpCategoryStatus', parameters).then(function (response) {
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
        var uploadImage = function (params) {
            var deferred = $q.defer();
            var fd = new FormData();
            fd.append('image', params.image);
            apiService.upload('admin/sp/uploadStripeDocsOnAws', fd).then(function (response) {
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
        var saveConcateImage = function (params) {
            var deferred = $q.defer();
            apiService.create('admin/sp/uploadStripeDocs', params).then(function (response) {
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
        var getAllSpForReports = function (params) {
            var deferred = $q.defer();
            apiService.get('admin/sp/reports', params).then(function (response) {
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

        var getReport = function (params) {
            var deferred = $q.defer();
            apiService.create('admin/sp/getSpReportDetails', params).then(function (response) {
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



        spService.getAllSp = getAllSp;
        spService.viewSp = viewSp;
        spService.changeSpStatus = changeSpStatus;
        spService.verifyCategoryService = verifyCategoryService;
        spService.uploadImage = uploadImage;
        spService.saveConcateImage = saveConcateImage;
        spService.getAllSpForReports = getAllSpForReports;
        spService.getReport = getReport;

        return spService;

    } ]);
} )();