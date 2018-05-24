/**
 * Created by Bilal on 04/30/2018.
 */
(function () {
    angular.module('notifications').controller("NotificationsController", NotificationsController);

    NotificationsController.$inject = ['$scope', 'toastr', '$state', 'notificationsServices', '$uibModal', 'usSpinnerService'];

    function NotificationsController($scope, toastr, $state, notificationsServices, $uibModal, usSpinnerService) {
        var notifications = this;
        notifications.itemsPerPage = 10;
        notifications.notifications = [];
        notifications.getNotifications = getNotifications;



        function getNotifications(tableState) {
            usSpinnerService.spin('spinner-1');
            notifications.noUserFound = false;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            var params = {
                offset: start,
                limit: number,
                searchText: notifications.search
            };

            return notificationsServices.getNotifications(params).then(function (res) {
                if (res.success == "1") {
                    usSpinnerService.stop('spinner-1');
                    notifications.currentPage = Math.floor(tableState.pagination.start / tableState.pagination.number);
                    tableState.pagination.numberOfPages = Math.ceil(res.data.totalRecords / notifications.itemsPerPage);
                    notifications.notifications = res.data.notifications;
                    if (res.data.notifications < 1) {
                        notifications.noUserFound = true;
                    }
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'Notifications');
                }
            });
        }
    }
})();
