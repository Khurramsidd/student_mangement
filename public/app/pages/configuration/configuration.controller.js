/**
 * Created by Bilal on 01/22/2018.
 */
( function () {
    angular.module('configuration').controller('configurationController', configurationController);

    configurationController.$inject = [ '$scope', '$state', '$stateParams', 'toastr', '$uibModal', 'configurationService', 'usSpinnerService', 'GlobalServices' ];

    function configurationController ($scope, $state, $stateParams, toastr, $uibModal, configurationService, usSpinnerService, GlobalServices) {
        var configuration = this;

        configuration.getRates = function () {
            usSpinnerService.spin('spinner-1');

            configurationService.getRates().then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    configuration.rate = res.data.rates;
                } else {

                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };

        configuration.updateRate = function () {
            usSpinnerService.spin('spinner-1');
            configuration.rate.rateId = configuration.rate._id;
            configurationService.updateRate(configuration.rate).then(function (res) {
                if ( res.success == '1' ) {
                    toastr.success(res.message);
                    usSpinnerService.stop('spinner-1');

                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });

        };


    }

} )();



