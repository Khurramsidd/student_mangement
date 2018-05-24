angular.module('BlurAdmin.pages').service('apiService', ['$http', '$q', 'appSettings', function ($http, $q, appSettings) {

    var apiService = {};
    var apiBase = appSettings.apiBase;

    //===========================GET RESOURCE==============================
    var get = function (module, parameter) {
        var deferred = $q.defer();
        $http.get(apiBase + module, {params: parameter}, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
            deferred.resolve(response.data);
        }).catch(function (data, status, headers, config) { // <--- catch instead error
            deferred.reject(data);
        });

        return deferred.promise;
    };

    //===========================CREATE RESOURCE==============================
    var create = function (module, parameter) {
        console.log("hitting Service=============");

        var deferred = $q.defer();

        $http.post(apiBase + module, parameter, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
            deferred.resolve(response.data);
        }).catch(function (data, status, headers, config) { // <--- catch instead error
            deferred.reject(data);
        });

        return deferred.promise;
    };


    //===========================UPDATE RESOURCE==============================
    var update = function (module, parameter) {
        console.log("hitting Service=============");

        var deferred = $q.defer();

        $http.post(apiBase + module, parameter, {headers: {'Content-Type': 'application/json'}}).then(function (response) {

            deferred.resolve(response.data);

        }).catch(function (data, status, headers, config) { // <--- catch instead error
            deferred.reject(data);
        });

        return deferred.promise;
    };


    //===========================DELETE RESOURCE==============================
    var delet = function (module, parameter) {
        console.log("hitting Service=============");
        var deferred = $q.defer();
        $http.post(apiBase + module, parameter, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
            deferred.resolve(response.data);
        }).catch(function (data, status, headers, config) { // <--- catch instead error
            deferred.reject(data);
        });
        return deferred.promise;
    };
    var upload = function (module, parameter) {
        console.log('hitting Service=============');
        var deferred = $q.defer();
        $http.post(apiBase + module, parameter, {
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            deferred.resolve(response.data);
        }).catch(function (data, status, headers, config) { // <--- catch instead error
            deferred.reject(data.statusText);
        });
        return deferred.promise;
    };


    apiService.get = get;
    apiService.create = create;
    apiService.update = update;
    apiService.delet = delet;
    apiService.upload = upload;
    return apiService;

}]);
