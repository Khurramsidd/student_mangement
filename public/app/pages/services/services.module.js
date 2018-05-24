/**
 * Created by Majid on 1/10/2018.
 */
(function () {
    'use strict';

    angular.module('services', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {

        function authentication(GlobalServices, $q, localStorageService, $state) {
            var d = $q.defer();
            var checkUser = localStorageService.get("user");
            if (checkUser !== null && checkUser.isAdmin === true) {
                d.resolve(checkUser);
            } else {
                GlobalServices.currentUser().then(function (data) {
                    if (data.success === 0) {
                        $state.go('login');
                    } else {
                        if (data.data.account.isAdmin == true) {
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
            .state('servicesListing', {
                url: '/services-listing',
                templateUrl: '../app/pages/services/servicesListing.html',
                title: 'Sub Services',
                controller: 'ServicesController',
                controllerAs: 'listing',
                sidebarMeta: {
                    icon: 'fa fa-th-list fa-lg',
                    order: 2,
                },
                resolve: {
                    $user: authentication
                },
            });
    }

})();