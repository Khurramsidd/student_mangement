// Services for DashBoard Controller
( function () {
    angular.module('BlurAdmin.pages.dashboard').service('dashBoardServices', [ '$q', 'apiService', function ($q, apiService) {
        var dbServices = {};

        var getDashboardAnalytics = function () {
            var deferred = $q.defer();
            apiService.get('admin/analytics').then(function (response) {
                    if ( response ) {
                        deferred.resolve(response);
                    }
                    else {
                        deferred.reject('Something went wrong while processing your request. Please Contact Administrator.');
                    }
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        dbServices.getDashboardAnalytics = getDashboardAnalytics;

        return dbServices;
    } ]);
} )();