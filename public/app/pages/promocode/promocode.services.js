(function () {
    angular.module('PromoCode').service('promoCodeServices', ['$q', 'apiService', function ($q, apiService) {

        var promoCodeServices = {};

        var save = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/promocode/add', parameters).then(function (response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject('Message to show');
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var getPromoCodes = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/promocode/getPromoCodes/'+parameters.offset+'/'+parameters.limit, parameters).then(function (response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject('Message to show');
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var promoCodeStatusUpdate = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/promocode/promoCodeStatusUpdate', parameters).then(function (response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject('Message to show');
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var sendMessagesToSeekers = function (parameters) {
            var deferred = $q.defer();
            apiService.create('admin/promocode/sendPromoCodeMsg', parameters).then(function (response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject('Message to show');
                },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        promoCodeServices.save = save;
        promoCodeServices.getPromoCodes = getPromoCodes;
        promoCodeServices.promoCodeStatusUpdate = promoCodeStatusUpdate;
        promoCodeServices.sendMessagesToSeekers = sendMessagesToSeekers;

        return promoCodeServices;

    }]);
})();