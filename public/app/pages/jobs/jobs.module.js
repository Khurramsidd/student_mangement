/**
 * Created by Bilal on 01/22/2018.
 */
(function () {
    'use strict';

    angular.module('jobs', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {

        function authentication(GlobalServices, $q, localStorageService, $state) {
            var d = $q.defer();
            var checkUser = localStorageService.get('user');
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
            .state('jobs', {
                url: '/jobs',
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                title: 'Appointments',
                sidebarMeta: {
                    icon: 'fa fa-briefcase fa-lg',
                    order: 28,
                },
                resolve: {
                    $user: authentication
                },
            })
            .state('jobs.scheduled', {
                url: '/scheduled-listing',
                templateUrl: '../app/pages/jobs/getJobsListing.html',
                title: 'Scheduled Appointments',
                controller: 'jobsController',
                controllerAs: 'listing',
                sidebarMeta: {
                    order: 2,
                    blank: false,
                },
                resolve: {
                    jobStatus: function () {
                        return {
                            value: 'Scheduled'
                        };
                    }
                }
            })
            .state('jobs.completedJobs', {
                url: '/completedJobs-listing',
                templateUrl: '../app/pages/jobs/getJobsListing.html',
                title: 'Completed Appointments',
                controller: 'jobsController',
                controllerAs: 'listing',
                sidebarMeta: {
                    order: 3,
                },
                resolve: {
                    jobStatus: function () {
                        return {
                            value: 'Completed'
                        };
                    }
                }
            })
            .state('jobs.cancelledJobs', {
                url: '/cancelledJobs-listing',
                templateUrl: '../app/pages/jobs/getJobsListing.html',
                title: 'Cancelled Appointments',
                controller: 'jobsController',
                controllerAs: 'listing',
                sidebarMeta: {
                    order: 4,
                },
                resolve: {
                    jobStatus: function () {
                        return {
                            value: 'Canceled'
                        };
                    }
                }
            })
            .state('jobs.unassignedJobs', {
                url: '/unassignedJobs-listing',
                templateUrl: '../app/pages/jobs/getJobsListing.html',
                title: 'unAssigned Appointments',
                controller: 'jobsController',
                controllerAs: "listing",
                sidebarMeta: {
                    order: 5,
                },
                resolve: {
                    jobStatus: function () {
                        return {
                            value: 'Requested'
                        };
                    }
                }
            })
            /* .state('jobs.getUnassignedJobs', {
                 url: '/Unassigned-listing',
                 templateUrl: '../app/pages/jobs/getJobsListing.html',
                 title: 'Unassigned Appointments',
                 controller: 'jobsController',
                 controllerAs: 'listing',
                 sidebarMeta: {
                     order: 1,
                 },
                 resolve: {
                     jobStatus: function () {
                         return {
                             value: 'Requested'
                         };
                     }
                 }
             })*/
            /* .state('jobs.finishedJobs', {
                url: '/finishedJobs-listing',
                templateUrl: '../app/pages/jobs/getJobsListing.html',
                title: 'Finished Jobs',
                controller: 'jobsController',
                controllerAs: "listing",
                sidebarMeta: {
                    order: 5,
                },
                resolve: {
                    jobStatus: function () {
                        return {
                            value: 'Finished'
                        };
                    }
                }
            })*/
            .state('job', {
                url: '/job/:jobId',
                controller: 'jobsController',
                controllerAs: 'listing',
                templateUrl: '../app/pages/jobs/jobsDetails.html',
                title: 'Appointment',
                resolve: {
                    jobStatus: function () {
                        return {
                            value: 'jobDetails'
                        };
                    },
                    $user: authentication
                }
            });

        $urlRouterProvider.when('/jobs', '/jobs/scheduled-listing');
    }

})();