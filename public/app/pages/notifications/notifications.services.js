
(function () {
    angular.module('notifications').service('notificationsServices', ['$q', 'apiService', function ($q, apiService) {

        var confServices = {};

        var getNotifications = function (parameters) {
            var deferred = $q.defer();
            apiService.get("admin/jobs/jobNotifications/"+parameters.offset+"/"+parameters.limit).then(function (response) {
                    if (response){
                        deferred.resolve(response);
                      }
                    else{
                        deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
                      }
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var getNotificationsNew = function () {
            var deferred = $q.defer();
            apiService.get("admin/jobs/jobNotificationsNew").then(function (response) {
                    if (response){
                        deferred.resolve(response);
                      }
                    else{
                        deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
                      }
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        confServices.getNotifications = getNotifications;
        confServices.getNotificationsNew = getNotificationsNew;

        return confServices;

    }]);
})();
