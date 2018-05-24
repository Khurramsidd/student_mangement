/**
 * Created by Majid on 07/02/2017.
 */
(function () {
    'use strict';

    angular.module('PromoCode', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig ($stateProvider) {

        function authentication (GlobalServices, $q, localStorageService, $state) {
            var d = $q.defer();
            console.log('Setting Authentication');
            var checkUser = localStorageService.get('user');
            if (checkUser !== null) {
                d.resolve(checkUser);
            } else {
                GlobalServices.currentUser().then(function (data) {
                    if (data.success === 0) {
                        $state.go('login');
                    } else {
                        console.log(data);
                        localStorageService.set('user', data.data);
                        d.resolve(data.user);
                    }
                });
            }
            return d.promise;
        }

        function settings (GlobalServices, $q) {

            var d = $q.defer();
            console.log('PromoCode Authentication');

            GlobalServices.adminSetting().then(function (data) {
                d.resolve(data.user);
            });

            return d.promise;
        }

        $stateProvider
            .state('promocode', {
                url: '/promocode',
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                title: 'PromoCode',
                sidebarMeta: {
                    icon: 'fa fa-tags',
                    order: 29,
                },
                resolve: {
                    $user: authentication
                },
            })
            .state('promocode.addPromoCode', {
                url: '/addpromocode',
                templateUrl: '../app/pages/promocode/promocode.html',
                title: 'Add PromoCode',
                controller: 'promoCodeCtrl',
                controllerAs: 'pCode',
                sidebarMeta: {
                    icon: 'fa fa-gift',
                    order: 2300,
                },
                resolve: {
                    $user: authentication
                },
            })
            .state('promocode.listing', {
                url: '/promocode-listing',
                templateUrl: '../app/pages/promocode/promocodeListing.html',
                controller: 'promoCodeCtrl',
                controllerAs: 'listing',
                title: 'PromoCode Listing',
                sidebarMeta: {
                    order: 0,
                    blank: false,
                },
            });
    }

})();
