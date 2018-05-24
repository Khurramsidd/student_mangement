
( function () {
    'use strict';
    angular.module('login', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig ($stateProvider) {

        function authentication (GlobalServices, $q, localStorageService, $state) {
            var d = $q.defer();
            GlobalServices.currentUser().then(function (data) {
                if ( data.success === 0 ) {
                    localStorageService.remove('user');
                    d.resolve(data);
                } else if ( data.success === 1 && data.data.account.isAdmin === true ) {
                    localStorageService.set('user', data.data.account);
                    $state.go('dashboard');
                } else {
                    localStorageService.remove('user');
                    d.resolve(data);
                }
            });
            return d.promise;
        }

        function isLogin ($q, localStorageService, $state) {
            var d = $q.defer();
            var checkUser = localStorageService.get('user');
            if ( checkUser !== null ) {
                d.resolve(checkUser);
            } else {
                $state.go('login');
            }
            return d.promise;
        }


        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '../app/pages/login/login.html',
                title: 'Login',
                controller: 'loginCtrl',
                controllerAs: 'login',
                resolve: {
                    $user: authentication
                },
            })
            .state('logout', {
                url: '/logout',
                title: 'Logout',
                controller: 'SignOutController',
                controllerAs: 'logout',
                sidebarMeta: {
                    icon: 'fa fa-power-off',
                    order: 250,
                },
                /* resolve: {
                    $user: isLogin
                },*/
            });
    }

} )();