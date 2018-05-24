( function () {
    angular.module('PromoCode').controller('promoCodeCtrl', promoCodeCtrl);

    promoCodeCtrl.$inject = [ '$scope', '$state', 'promoCodeServices', 'toastr', 'usSpinnerService', '$uibModal' ];

    function promoCodeCtrl ($scope, $state, promoCodeServices, toastr, usSpinnerService, $uibModal) {
        var pCode = this;

        pCode.promoCodes = [];
        pCode.promoCodeInformation = {};
        pCode.todayDate = new Date().toISOString().split('T')[ 0 ];

        // save
        pCode.save = function (data) {
            usSpinnerService.spin('spinner-1');
            // test values for checking save functionality
            // pCode.promoCodeInformation.startDate = new Date();
            // pCode.promoCodeInformation.endDate = 1511118000000;
            return promoCodeServices.save(data).then(function (response) {
                if ( response.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    toastr.success(response.message);
                    $state.go('promocode.listing');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(response.message);
                }
            });
        };

        pCode.getPromoCodes = function (tableState) {
            usSpinnerService.spin('spinner-1');
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            var params = {
                offset: start,
                limit: number,
                searchText: pCode.search
            };
            return promoCodeServices.getPromoCodes(params).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    pCode.noUserFound = false;
                    pCode.currentPage = Math.floor(tableState.pagination.start / tableState.pagination.number);
                    tableState.pagination.numberOfPages = Math.ceil(res.data.totalRecords / pCode.itemsPerPage);
                    pCode.promoCodes = res.data.promoCodes;
                    if ( res.data.promoCodes < 1 ) {
                        pCode.noUserFound = true;
                    }
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'PromoCode');
                }
            });
        };

        pCode.blockCode = function (item) {
            usSpinnerService.spin('spinner-1');
            var params = {
                _id: item._id,
                status: true
            };
            return promoCodeServices.promoCodeStatusUpdate(params).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    $state.reload();
                    toastr.success(res.message, 'PromoCode');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'PromoCode');
                }
            });
        };

        pCode.unBlockCode = function (item) {
            usSpinnerService.spin('spinner-1');
            var params = {
                _id: item._id,
                status: false
            };
            return promoCodeServices.promoCodeStatusUpdate(params).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    $state.reload();
                    toastr.success(res.message, 'PromoCode');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'PromoCode');
                }
            });
        };

        pCode.sendMessagesToSeekers = function (item) {
            usSpinnerService.spin('spinner-1');
            var params = {
                promoId: item._id,
                promoMsg: item.promoMessage
            };

            return promoCodeServices.sendMessagesToSeekers(params).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    $state.reload();
                    toastr.success(res.message);
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });


        };

    }

} )();



