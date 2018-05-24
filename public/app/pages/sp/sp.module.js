/**
 * Created by Majid on 9/28/2017.
 */
( function () {
    'use strict';

    angular.module('sp', []).config(routeConfig);

    /** @ngInject */
    function routeConfig ($stateProvider, $urlRouterProvider) {

        function authentication (GlobalServices, $q, localStorageService, $state) {
            var d = $q.defer();
            var checkUser = localStorageService.get('user');
            if ( checkUser !== null && checkUser.userType == 'ADMIN' ) {
                d.resolve(checkUser);
            } else {
                GlobalServices.currentUser().then(function (data) {
                    if ( data.success === 0 ) {
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
            .state('sp', {
                url: '/sp',
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                controller: 'spMainController',
                title: 'Service Providers',
                sidebarMeta: {
                    icon: 'fa fa-street-view fa-lg',
                    order: 10,
                },
                resolve: {
                    $user: authentication
                },
            })
            .state('sp.newRequest', {
                url: '/new-requests',
                templateUrl: '../app/pages/sp/spListing/newRequestsListing.html',
                controller: 'spListingController',
                controllerAs: 'listing',
                title: 'New Request',
                sidebarMeta: {
                    order: 0,
                    blank: false,
                },
            })
            .state('sp.listing', {
                url: '/listing',
                templateUrl: '../app/pages/sp/spListing/spListing.html',
                controller: 'spListingController',
                controllerAs: 'listing',
                title: 'Service Provider List',
                sidebarMeta: {
                    order: 1,
                    blank: false,
                },
            })
            .state('sp.rejectListing', {
                url: '/reject',
                templateUrl: '../app/pages/sp/spListing/spRejectListing.html',
                controller: 'spListingController',
                controllerAs: 'listing',
                title: 'Rejected List',
                sidebarMeta: {
                    order: 2,
                    blank: false,
                },
            })
            .state('sp.reports', {
                url: '/reports',
                templateUrl: '../app/pages/sp/spListing/reports.html',
                controller: 'spListingController',
                controllerAs: 'ctg',
                title: 'Service Provider Report',
                sidebarMeta: {
                    order: 3,
                }
            })
            .state('spView', {
                url: '/sp/:spId',
                templateUrl: '../app/pages/sp/spListing/spView.html',
                title: 'Profile',
                controller: 'spListingController',
                controllerAs: 'profile'
            });

        $urlRouterProvider.when('/sp', '/sp/listing');
    }

} )();