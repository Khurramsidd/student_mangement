//Services for Jobs Controller
(function () {
    angular.module('jobs').service('jobsServices', ['$q', 'apiService', function ($q, apiService) {
        var dbServices = {};

        var getAllJobs = function (parameters) {
            var deferred = $q.defer();

            apiService.get('admin/jobs/getJobList/'+ parameters.status + "/" + parameters.offset + "/" + parameters.limit).then(function (response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var getJobDetailByID = function (parameters) {
            var deferred = $q.defer();

            apiService.get('admin/jobs/getJobDetails/'+ parameters).then(function (response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var getHelpmates = function (parameters) {
            var deferred = $q.defer();

            apiService.create('user/job/admin/fetch/service/provider/list', parameters).then(function (response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var assignHelpmate = function (parameters) {
            var deferred = $q.defer();

            apiService.create('sp/job/admin/assign/job', parameters).then(function (response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        dbServices.getAllJobs = getAllJobs;
        dbServices.getJobDetailByID = getJobDetailByID;
        dbServices.getHelpmates = getHelpmates;
        dbServices.assignHelpmate = assignHelpmate;

        return dbServices;
    }]);
})();