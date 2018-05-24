/**
 * Created by Majid on 9/28/2017.
 */
(function () {
    'use strict';

    angular.module('user', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {

        function authentication(GlobalServices, $q, localStorageService, $state) {
            var d = $q.defer();
            var checkUser = localStorageService.get("user");
            if (checkUser !== null && checkUser.userType == 'ADMIN') {
                d.resolve(checkUser);
            } else {
                GlobalServices.currentUser().then(function (data) {
                    if (data.success === 0) {
                        $state.go('login');
                    } else {
                        localStorageService.set('user', data.data.account);
                        d.resolve(data.user);
                    }
                });
            }
            return d.promise;
        }

        $stateProvider
            .state('user', {
                url: '/users',
                templateUrl: '../app/pages/user/userListing.html',
                title: 'Users',
                controller: 'userListingController',
                controllerAs: 'listing',
                sidebarMeta: {
                    icon: 'fa fa-users fa-lg',
                    order: 15,
                },
                resolve: {
                    $user: authentication
                },
            })
            .state('userView', {
                url: '/user/:userId',
                templateUrl: '../app/pages/user/userView.html',
                title: 'Profile',
                controller: 'userListingController',
                controllerAs: 'profile'
            });
    }

})();