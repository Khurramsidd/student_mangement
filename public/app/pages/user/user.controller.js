/**
 * Created by Majid on 9/28/2017.
 */
( function () {
    angular.module('user').controller('userListingController', userListingController);

    userListingController.$inject = [ '$scope', '$state', '$stateParams', 'toastr', '$uibModal', 'userService', 'usSpinnerService', 'GlobalServices' ];

    function userListingController ($scope, $state, $stateParams, toastr, $uibModal, userService, usSpinnerService, GlobalServices) {
        var user = this;
        user.search = '';
        user.itemsPerPage = 10;
        user.users = [];
        user.user = {};

        user.getUsers = getUsers;
        user.changeUserStatus = changeUserStatus;
        user.viewUser = viewUser;

        function getUsers (tableState) {
            usSpinnerService.spin('spinner-1');
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            var params = {
                offset: start,
                limit: number,
                searchText: user.search,
                status: 'active'
            };
            return userService.getUsers(params).then(function (res) {
                if ( res.success == '1' ) {
                    user.users = res.data.users;
                    user.usersData = res.data.users;
                    user.currentPage = Math.floor(tableState.pagination.start / tableState.pagination.number);
                    tableState.pagination.numberOfPages = Math.ceil(res.data.totalRecords / user.itemsPerPage);
                    if ( res.data.totalRecords == 0 ) {
                        user.noUserFound = true;
                    }
                    usSpinnerService.stop('spinner-1');
                } else {
                    toastr.error(res.message, 'Get Users');
                    usSpinnerService.stop('spinner-1');
                }
            });
        }


        function viewUser () {
            usSpinnerService.spin('spinner-1');
            return userService.viewUser($state.params.userId).then(function (res) {
                if ( res.success == '1' ) {
                    user.user = res.data.user;
                    usSpinnerService.stop('spinner-1');
                } else {
                    toastr.error(res.message, 'User Details');
                    usSpinnerService.stop('spinner-1');
                }
            });
        }

        function changeUserStatus (status) {
            usSpinnerService.spin('spinner-1');
            var params = {
                status: status,
                userId: $state.params.userId
            };
            return userService.changeUserStatus(params).then(function (res) {
                if ( res.success == '1' ) {
                    $state.reload();
                    usSpinnerService.stop('spinner-1');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'User Status');
                }
            });
        }

    }


} )();



