/**
 * Created by Majid on 9/28/2017.
 */
( function () {
    angular.module('sp').controller('spListingController', spListingController);

    spListingController.$inject = [ '$scope', '$state', '$stateParams', 'toastr', '$uibModal', 'spService', 'usSpinnerService', 'GlobalServices', '$filter' ];

    function spListingController ($scope, $state, $stateParams, toastr, $uibModal, spService, usSpinnerService, GlobalServices, $filter) {
        var sp = this;
        sp.selectedService = null;
        sp.search = '';
        sp.itemsPerPage = 10;
        sp.allSp = [];
        sp.sp = {};
        sp.reportParams = {};
        sp.noRecordsFound = true;
        sp.getAllSp = getAllSp;
        sp.getRejectSp = getRejectSp;
        sp.getNewSp = getNewSp;
        sp.changeSpStatus = changeSpStatus;
        sp.viewSp = viewSp;
        sp.sendMail = sendMail;
        sp.downloadImageFront = downloadImageFront;
        sp.downloadImageBack = downloadImageBack;
        sp.myArr = [];

        sp.verifyCategoryService = function (item, status, imageId) {
            usSpinnerService.spin('spinner-1');
            var params = {};
            if ( status == 'disApprove' ) {
                params = {
                    status: status,
                    categoryId: item.categoryId,
                    licenseImage: imageId._id,
                    serviceId: item._id
                };
            } else {
                params = {
                    status: status,
                    categoryId: item._id,
                    licenseImage: imageId._id,
                    serviceId: item.serviceId._id
                };
            }
            return spService.verifyCategoryService(params).then(function (res) {
                if ( res.success == '1' ) {
                    $state.reload();
                    usSpinnerService.stop('spinner-1');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'SP Request');
                }
            });
        }

        function getAllSp (tableState) {
            usSpinnerService.spin('spinner-1');
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            var params = {
                offset: start,
                limit: number,
                searchText: sp.search,
                status: 'active'
            };
            return spService.getAllSp(params).then(function (res) {
                if ( res.success == '1' ) {
                    sp.sp = res.data.sp;
                    sp.spData = res.data.sp;
                    sp.currentPage = Math.floor(tableState.pagination.start / tableState.pagination.number);
                    tableState.pagination.numberOfPages = Math.ceil(res.data.totalRecords / sp.itemsPerPage);
                    if ( res.data.totalRecords == 0 ) {
                        sp.noUserFound = true;
                    } else {
                        sp.noUserFound = false;
                    }
                    usSpinnerService.stop('spinner-1');
                } else {
                    toastr.error(res.message, 'Get SP');
                    usSpinnerService.stop('spinner-1');
                }
            });
        }

        function getRejectSp (tableState) {
            usSpinnerService.spin('spinner-1');
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            var params = {
                offset: start,
                limit: number,
                searchText: sp.search,
                status: 'rejected'
            };
            return spService.getAllSp(params).then(function (res) {
                if ( res.success == '1' ) {
                    sp.sp = res.data.sp;
                    sp.spData = res.data.sp;
                    sp.currentPage = Math.floor(tableState.pagination.start / tableState.pagination.number);
                    tableState.pagination.numberOfPages = Math.ceil(res.data.totalRecords / sp.itemsPerPage);
                    if ( res.data.totalRecords == 0 ) {
                        sp.noUserFound = true;
                    } else {
                        sp.noUserFound = false;
                    }
                    usSpinnerService.stop('spinner-1');
                } else {
                    toastr.error(res.message, 'Get Helpers');
                    usSpinnerService.stop('spinner-1');
                }
            });
        }

        function getNewSp (tableState) {
            usSpinnerService.spin('spinner-1');
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            var params = {
                offset: start,
                limit: number,
                searchText: sp.search,
                status: 'new'
            };
            return spService.getAllSp(params).then(function (res) {
                if ( res.success == '1' ) {
                    sp.sp = res.data.sp;
                    sp.spData = res.data.sp;
                    sp.currentPage = Math.floor(tableState.pagination.start / tableState.pagination.number);
                    tableState.pagination.numberOfPages = Math.ceil(res.data.totalRecords / sp.itemsPerPage);
                    if ( res.data.totalRecords == 0 ) {
                        sp.noUserFound = true;
                    } else {
                        sp.noUserFound = false;
                    }
                    usSpinnerService.stop('spinner-1');
                } else {
                    toastr.error(res.message, 'Get SP');
                    usSpinnerService.stop('spinner-1');
                }
            });
        }

        var reportParams = {
            searchText: sp.search,
            status: 'active'
        };
        sp.getSp = function () {
            usSpinnerService.spin('spinner-1');
            return spService.getAllSpForReports(reportParams).then(function (res) {
                if ( res.success == '1' ) {
                    sp.suggestedSp = res.data;
                    usSpinnerService.stop('spinner-1');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };

        sp.spList = function () {
            return sp.suggestedSp;
        };

        sp.getReport = function () {
            var params = {
                spId: sp.reportParams.spId._id,
                startDate: $filter('date')(sp.reportParams.startDate, 'yyyy-MM-dd'),
                endDate: $filter('date')(sp.reportParams.endDate, 'yyyy-MM-dd')
            };
            usSpinnerService.spin('spinner-1');
            return spService.getReport(params).then(function (res) {
                if ( res.success == '1' ) {
                    if ( res.data.spEarning.length > 0 ) {
                        sp.noRecordsFound = false;
                        toastr.success(res.message);
                        sp.reports = res.data.spEarning[ 0 ];
                    } else {
                        sp.noRecordsFound = true;
                        sp.reports = [];
                        usSpinnerService.stop('spinner-1');
                        toastr.success(res.message);
                    }
                    usSpinnerService.stop('spinner-1');
                } else {
                    sp.noRecordsFound = true;
                    sp.reports = [];
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        };

        function changeSpStatus (status) {
            usSpinnerService.spin('spinner-1');
            var params = {
                status: status,
                spId: $state.params.spId
            };
            return spService.changeSpStatus(params).then(function (res) {
                if ( res.success == '1' ) {
                    $state.reload();
                    usSpinnerService.stop('spinner-1');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'SP Request');
                }
            });
        }

        function viewSp () {
            usSpinnerService.spin('spinner-1');
            var params = {
                id: $stateParams.spId
            };
            return spService.viewSp(params).then(function (res) {
                if ( res.success == '1' ) {
                    angular.forEach(res.data.sp.spData.servicesOffered, (item) => {
                        if ( item.serviceId ) {
                            sp.myArr.push(item);
                        }
                    });

                    sp.sp = res.data.sp;
                    usSpinnerService.stop('spinner-1');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'View SP Profile');
                }
            });
        }

        function blockUser () {
            usSpinnerService.spin('spinner-1');
            var params = {
                id: sp.sp._id
            };
            return GlobalServices.blockUser(params).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    $state.reload();
                    toastr.success(res.message, 'Helpmate');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'Helpmate');
                }
            });
        }

        function unBlockUser () {
            usSpinnerService.spin('spinner-1');
            var params = {
                id: sp.sp._id
            };
            return GlobalServices.unBlockUser(params).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    $state.reload();
                    toastr.success(res.message, 'Helpmate');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'Helpmate');
                }
            });
        }

        function sendMail () {
            $uibModal.open({
                controller: 'EmailController',
                controllerAs: 'email',
                templateUrl: '../app/pages/helpmates/helperListing/sendEmail.html',
                resolve: {
                    key: function () {
                        return sp.sp;
                    }
                }
            });
        }

        $scope.getFile = function () {
            usSpinnerService.spin('spinner-1');
            var file = this.file;
            if ( file != undefined ) {
                if ( file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg' ) {
                    if ( file.size < 160000000 ) {
                        var params = {
                            image: file
                        };
                        return spService.uploadImage(params).then(function (res) {
                            if ( res.success == '1' ) {
                                var parameters = {
                                    spId: sp.sp._id,
                                    imageUrl: res.data.newProfileURL
                                };
                                var url = res.data.newProfileURL;
                                return spService.saveConcateImage(parameters).then(function (res) {
                                    if ( res.success == '1' ) {
                                        toastr.success('Image uploaded successfully.', 'Upload');
                                        sp.sp.licenseImage = url;
                                        usSpinnerService.stop('spinner-1');
                                    } else {
                                        usSpinnerService.stop('spinner-1');
                                        toastr.error(res.message, 'Upload');
                                    }
                                });
                            } else {
                                usSpinnerService.stop('spinner-1');
                                toastr.error(res.error, 'Upload');
                            }
                        });
                    } else {
                        toastr.error('Image must be less than 20Mb.', 'Upload');
                        usSpinnerService.stop('spinner-1');
                    }
                } else {
                    toastr.error('Only file type image is allowed.', 'Upload');
                    usSpinnerService.stop('spinner-1');
                }
            } else {
                usSpinnerService.stop('spinner-1');
            }
        };


        function downloadImageFront (item) {
            var images = document.querySelector('#front-card');
            usSpinnerService.spin('spinner-1');
            if ( item ) {
                usSpinnerService.stop('spinner-1');
                images.download = item;
                images.href = item;
                toastr.success('Downlaoding Image...', 'Download');
            } else {
                usSpinnerService.stop('spinner-1');
                toastr.error('No Image Found', 'Download');
            }
        }

        function downloadImageBack (item) {
            var images = document.querySelector('#back-card');
            usSpinnerService.spin('spinner-1');
            if ( item ) {
                usSpinnerService.stop('spinner-1');
                images.download = item;
                images.href = item;
                toastr.success('Downlaoding Image...', 'Download');
            } else {
                usSpinnerService.stop('spinner-1');
                toastr.error('No Image Found', 'Download');
            }
        }
    }

    angular.module('sp').controller('EmailController', function ($scope, $uibModalInstance, $state, usSpinnerService, spService, key, toastr) {
        var email = this;
        email.emailData = {};
        email.emailData.mailTo = angular.copy(key.email);
        email.emailData.subject = 'Helpconnect: Requirements For Account Approval';
        email.sendMail = function () {
            usSpinnerService.spin('spinner-1');
            var params = email.emailData;
            return spService.sendMail(params).then(function (res) {
                if ( res.success == '1' ) {
                    usSpinnerService.stop('spinner-1');
                    $uibModalInstance.close();
                    toastr.success(res.message, 'Email');
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message, 'Email');
                }
            });
        };
    });


} )();



