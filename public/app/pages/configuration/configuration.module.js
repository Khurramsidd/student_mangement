/**
 * Created by Bilal on 01/22/2018.
 */
( function () {
    'use strict';

    angular.module('configuration', []).config(routeConfig);

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
            .state('configuration', {
                url: '/configuration',
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                title: 'Configuration',
                sidebarMeta: {
                    icon: 'fa fa-cog fa-lg',
                    order: 30,
                },
                resolve: {
                    $user: authentication
                },
            })
            .state('configuration.rate', {
                url: '/rate',
                templateUrl: '../app/pages/configuration/rate.html',
                controller: 'configurationController',
                controllerAs: 'rate',
                title: 'Settings',
                sidebarMeta: {
                    order: 0,
                    blank: false,
                },
            });

        $urlRouterProvider.when('/configuration', '/configuration/configuration');
    }

} )();