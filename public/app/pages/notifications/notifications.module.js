
(function () {
  'use strict';

  angular.module('notifications', []).config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {

      function authentication(GlobalServices, $q, localStorageService, $state) {
          var d = $q.defer();
          var checkUser = localStorageService.get("user");
          if (checkUser !== null &&  checkUser.isAdmin === true) {
              d.resolve(checkUser);
          } else {
              GlobalServices.currentUser().then(function (data) {
                  if (data.success === 0) {
                      $state.go('login');
                  } else {
                      if (data.data.account.isAdmin === true) {
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
        .state('notifications', {
          url: '/notifications',
          templateUrl: '../app/pages/notifications/notifications.html',
          controller: 'NotificationsController',
          controllerAs: "listing",
          title: 'Notifications',
          sidebarMeta: {
            icon: 'fa fa-bell fa-lg',
            order: 35,
          },
          resolve: {
              $user: authentication
          },
        });

    $urlRouterProvider.when('/notifications','/notifications');
  }

})();
