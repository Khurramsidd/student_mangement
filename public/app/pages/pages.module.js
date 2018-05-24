/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
( function () {
    'use strict';
    angular.module('BlurAdmin.pages', [
        'ui.router', 'LocalStorageModule', 'BlurAdmin.pages.dashboard',
        'angularSpinner', 'login', 'sp', 'user', 'configuration', 'categories', 'PromoCode', 'jobs', 'services', 'notifications'
    ]).config(routeConfig);

    /** @ngInject */
    function routeConfig ($urlRouterProvider, baSidebarServiceProvider) {
        $urlRouterProvider.otherwise('/login');
    }

    angular.module('BlurAdmin.pages').config([ '$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
    } ]);

    angular.module('BlurAdmin.pages').config([ 'usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
        usSpinnerConfigProvider.setDefaults({ color: '#149A9A', radius: 15, width: 6, length: 12 });
    } ]);

    angular.module('BlurAdmin.pages').config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('PamperMoi')
            .setStorageType('sessionStorage');
    });

    angular.module('BlurAdmin.pages').constant('appSettings', appConfig);

    angular.module('BlurAdmin.pages').config(function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    });

} )();
