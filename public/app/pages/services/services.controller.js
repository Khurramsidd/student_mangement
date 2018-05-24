/**
 * Created by Majid on 1/10/2018.
 */
( function () {
    angular.module('services').controller('ServicesController', ServicesController);

    ServicesController.$inject = [ '$scope', '$state', 'servicesServices', 'toastr', 'usSpinnerService', '$uibModal' ];

    function ServicesController ($scope, $state, servicesServices, toastr, usSpinnerService, $uibModal) {
        var services = this;

        services.services = [];
        services.itemsPerPage = 10;

        services.getServices = function (tableState) {
            usSpinnerService.spin('spinner-1');
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            var params = {
                offset: start,
                limit: number,
                searchText: services.search
            };
            return servicesServices.getServices(params).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    services.noUserFound = false;
                    services.currentPage = Math.floor(tableState.pagination.start / tableState.pagination.number);
                    tableState.pagination.numberOfPages = Math.ceil(res.data.totalRecords / services.itemsPerPage);
                    services.services = res.data.tasks;
                    if ( res.data.tasks < 1 ) {
                        services.noUserFound = true;
                    }
                } else {
                    if ( res.response == 401 ) {
                        $state.go('login');
                    }
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };

        services.addService = function () {
            usSpinnerService.spin('spinner-1');
            return servicesServices.getCategories().then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    $uibModal.open({
                        controller: 'addEditServicesCtrl',
                        controllerAs: 'addEdit',
                        templateUrl: '../app/pages/services/addService.html',
                        resolve: {
                            $item: function () {
                                return services.services;
                            },
                            $categories: function () {
                                return res.data.categories;
                            }
                        }
                    });
                } else {
                    if ( res.response == 401 ) {
                        $state.go('login');
                    }
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };

        services.editService = function (item) {
            usSpinnerService.spin('spinner-1');
            return servicesServices.getCategories().then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    $uibModal.open({
                        controller: 'addEditServicesCtrl',
                        controllerAs: 'addEdit',
                        templateUrl: '../app/pages/services/editService.html',
                        resolve: {
                            $item: function () {
                                return item;
                            },
                            $categories: function () {
                                return res.data.categories;
                            }
                        }
                    });
                } else {
                    if ( res.response == 401 ) {
                        $state.go('login');
                    }
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };

        services.serviceStatusUpdate = function (item) {
            usSpinnerService.spin('spinner-1');
            let params = {
                _id: item._id,
                isArchive: 0
            };
            if ( item.isArchive == false ) {
                params.isArchive = 1;
            }
            return servicesServices.editService(params).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    item.isArchive = res.data.task.isArchive;
                    toastr.success(res.message);
                } else {
                    if ( res.response == 401 ) {
                        $state.go('login');
                    }
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };


    }

    angular.module('services').controller('addEditServicesCtrl', function ($scope, $uibModalInstance, $state, usSpinnerService, servicesServices, $item, $categories, toastr) {
        var service = this;
        $scope.elements = angular.isArray($item) ? [] : angular.copy($item.rates);

        $scope.newItem = function () {
            if ( $scope.elements.length <= 9 ) {
                $scope.elements.push({ durationInMins: '', charges: '' });
            } else {
                toastr.error('Cannot add more than 10 Ingredients.');
            }

        };

        service.categories = $categories;
        service.service = angular.isArray($item) ? {} : angular.copy($item);

        service.addService = function () {

            service.service.nameEng = service.service.name.en;
            service.service.nameFr = service.service.name.fr;
            service.service.rates = $scope.elements;
            usSpinnerService.spin('spinner-1');
            return servicesServices.addService(service.service).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    var newService = {};
                    $state.reload();

                    $item.splice(0, 0, newService);
                    $uibModalInstance.close();
                    toastr.success(res.message);
                } else {
                    if ( res.response == 401 ) {
                        $state.go('login');
                    }
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };

        service.editService = function () {
            usSpinnerService.spin('spinner-1');
            let params = {
                _id: service.service._id,
                nameEng: service.service.name.en,
                nameFr: service.service.name.fr,
                serviceId: service.service.serviceId._id,
                rates: $scope.elements
            };
            return servicesServices.editService(params).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    $uibModalInstance.close();
                   $state.reload();
                    toastr.success(res.message);
                } else {
                    if ( res.response == 401 ) {
                        $state.go('login');
                    }
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };


    });

} )();



