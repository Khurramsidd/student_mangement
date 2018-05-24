        /**
 * Created by Bilal on 2/20/2018.
 */
( function () {
    angular.module('BlurAdmin.pages.dashboard').controller('DashBoardController', dashBoardController);

    dashBoardController.$inject = [ 'toastr', 'dashBoardServices', 'usSpinnerService' ];

    function dashBoardController (toastr, dashBoardServices, usSpinnerService) {
        var ctg = this;
        ctg.getAnalytics = function () {
            usSpinnerService.spin('spinner-1');
            dashBoardServices.getDashboardAnalytics().then(function (res) {
                if ( res.success === 1 ) {
                    usSpinnerService.stop('spinner-1');
                    ctg.analytics = res.data.analytics;
                    ctg.analytics.total = parseFloat(res.data.analytics.spEarning) + parseFloat(res.data.analytics.earnings);
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };
         ctg.getAnalytics();
    }
} )();