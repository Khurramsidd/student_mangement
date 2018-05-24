/**
 * Created by Majid on 1/10/2018.
 */
(function () {
    angular.module('categories').controller('CategoriesController', CategoriesController);

    CategoriesController.$inject = ['$scope', '$state', 'categoriesServices', 'toastr', 'usSpinnerService', '$uibModal'];

    function CategoriesController($scope, $state, categoriesServices, toastr, usSpinnerService, $uibModal) {
        var categories = this;

        categories.categories = [];
        categories.itemsPerPage = 10;

        categories.getCategories = function (tableState) {
            usSpinnerService.spin('spinner-1');
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            var params = {
                offset: start,
                limit: number,
                searchText: categories.search
            };
            return categoriesServices.getCategories(params).then(function (res) {
                if (res.success == '1') {
                    usSpinnerService.stop('spinner-1');
                    categories.noUserFound = false;
                    categories.currentPage = Math.floor(tableState.pagination.start / tableState.pagination.number);
                    tableState.pagination.numberOfPages = Math.ceil(res.data.totalRecords / categories.itemsPerPage);
                    categories.categories = res.data.services;
                    if (res.data.categories < 1) {
                        categories.noUserFound = true;
                    }
                } else {
                    if (res.response == 401) {
                        $state.go('login');
                    }
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };

        categories.addCategory = function () {
            $uibModal.open({
                controller: 'addEditCategoriesCtrl',
                controllerAs: 'addEdit',
                templateUrl: '../app/pages/categories/addCategory.html',
                resolve: {
                    $item: function () {
                        return categories.categories;
                    }
                }
            });
        };

        categories.editCategory = function (item) {
            $uibModal.open({
                controller: 'addEditCategoriesCtrl',
                controllerAs: 'addEdit',
                templateUrl: '../app/pages/categories/editCategory.html',
                resolve: {
                    $item: function () {
                        return item;
                    }
                }
            });
        };

        categories.categoryStatusUpdate = function (item, status) {
            usSpinnerService.spin('spinner-1');
            let params = {
                _id: item._id
            };
            if (status === true) {
                params.isArchive = true;
            }

            if (status === false) {
                params.isArchive = false;
            }

            console.log(params)
            return categoriesServices.editCategory(params).then(function (res) {
                if (res.success == '1') {
                    usSpinnerService.stop('spinner-1');
                    item.isArchive = res.data.category.isArchive;

                    toastr.success(res.message);
                } else {
                    if (res.response == 401) {
                        $state.go('login');
                    }
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };
    }

    angular.module('categories').controller('addEditCategoriesCtrl', function ($scope, $uibModalInstance, $state, usSpinnerService, categoriesServices, $item, toastr) {
        var category = this;

        category.category = angular.isArray($item) ? {} : angular.copy($item);
        if ($item && $item.length) {
            category.category.nameEng = '';
            category.category.nameFr = '';

        }
        else {
            category.category.nameEng = category.category.name.en;

            category.category.nameFr = category.category.name.fr;

        }

        // category.category.nameEng = category.category.name.en;
        // category.category.nameFr = category.category.name.fr;
        // category.category.nameEng = $item.name.en;
        // category.category.nameFr = $item.name.fr;

        category.addCategory = function () {
            usSpinnerService.spin('spinner-1');
            return categoriesServices.addCategory(category.category).then(function (res) {
                if (res.success == '1') {
                    usSpinnerService.stop('spinner-1');
                    var newCategory = {};
                    newCategory._id = res.data.category._id;
                    newCategory.name = res.data.category.name;
                    newCategory.status = res.data.category.status;
                    $item.splice(0, 0, newCategory);
                    $uibModalInstance.close();
                    toastr.success(res.message);
                } else {
                    if (res.response == 401) {
                        $state.go('login');
                    }
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };

        category.editCategory = function () {
            usSpinnerService.spin('spinner-1');
            return categoriesServices.editCategory(category.category).then(function (res) {
                if (res.success == '1') {
                    usSpinnerService.stop('spinner-1');
                    $uibModalInstance.close();
                    $state.reload();
                    toastr.success(res.message);
                } else {
                    if (res.response == 401) {
                        $state.go('login');
                    }
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };


    });

})();



