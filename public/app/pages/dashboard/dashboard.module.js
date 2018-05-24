/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
( function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig ($stateProvider) {

        function authentication (GlobalServices, $q, localStorageService, $state) {
            var d = $q.defer();
            var checkUser = localStorageService.get('user');
            if ( checkUser !== null && checkUser.isAdmin === true ) {
                d.resolve(checkUser);
            } else {
                GlobalServices.currentUser().then(function (data) {
                    if ( data.success === 0 ) {
                        $state.go('login');
                    } else {
                        if ( data.data.account.isAdmin === true ) {
                            localStorageService.set('user', data.data.account);
                            d.resolve(data.data.account);
                        } else {
                            $state.go('login');
                        }
                    }
                });
            }
            return d.promise;
        }

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '../app/pages/dashboard/dashboard.html',
                title: 'Dashboard',
                controller: 'DashBoardController',
                controllerAs: 'dashBoard',
                sidebarMeta: {
                    icon: 'fa fa-dashboard fa-lg',
                    order: 0,
                },
                resolve: {
                    $user: authentication
                },
            });
    }

} )();
