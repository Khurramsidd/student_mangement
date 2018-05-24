/**
 * Created by Bilal on 01/22/2018.
 */
(function () {
    angular.module('jobs').controller('jobsController', jobsController);

    jobsController.$inject = ['$stateParams', 'toastr', 'jobsServices', 'usSpinnerService', 'jobStatus', '$uibModal'];

    function jobsController($stateParams, toastr, jobsServices, usSpinnerService, jobStatus, $uibModal) {
        var jobs = this;

        jobs.itemsPerPage = 10;
        jobs.jobsScheduled = [];
        jobs.noRecordsFound = true;

        jobs.getAllJobs = getAllJobs;
        jobs.viewJobData = viewJobData;
        jobs.statusTable = jobStatus.value;
        jobs.getHelpmates = getHelpmates;

        function getAllJobs(tableState) {
            usSpinnerService.spin('spinner-1');
            jobs.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            var params = {
                offset: start,
                limit: number,
                search: jobs.search,
                status: jobStatus.value
            };

            return jobsServices.getAllJobs(params).then(function (res) {
                if (res.success == '1') {
                    usSpinnerService.stop('spinner-1');
                    jobs.currentPage = Math.floor(tableState.pagination.start / tableState.pagination.number);
                    tableState.pagination.numberOfPages = Math.ceil(res.data.jobsCount / jobs.itemsPerPage);
                    jobs.jobsScheduled = res.data.JobObjects;
                    if (res.data.jobs < 1) {
                        jobs.noUserFound = true;
                    }
                } else {
                    jobs.noUserFound = true;
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        }

        function viewJobData() {
            usSpinnerService.spin('spinner-1');
            return jobsServices.getJobDetailByID($stateParams.jobId).then(function (res) {
                if (res.success == '1') {
                    usSpinnerService.stop('spinner-1');
                    jobs.jobData = res.data.JobObjects;
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        }

        function getHelpmates(jobData) {
            usSpinnerService.spin('spinner-1');
            var params = {
                address: jobData.address,
                lat: jobData.location.coordinates[1],
                long: jobData.location.coordinates[0],
                date: jobData.orderDateTime.day,
                month: jobData.orderDateTime.month,
                year: jobData.orderDateTime.year,
                startHour: jobData.orderDateTime.startHour,
                startHourMinute: jobData.orderDateTime.startHourMinute,
                endHour: jobData.orderDateTime.endHour,
                endHourMinute: jobData.orderDateTime.endHourMinute,
                serviceId: jobData.serviceId._id,
                subServiceId: jobData.subServiceId._id,
                spType: 1,
                userLocalTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };
            return jobsServices.getHelpmates(params).then(function (res) {
                if (res.success == '1') {
                    usSpinnerService.stop('spinner-1');
                    if (res.data.availableSPList.length > 0) {
                        $uibModal.open({
                            controller: 'AssignHelpmateController',
                            controllerAs: 'assign',
                            templateUrl: '../app/pages/jobs/helpmatesModal.html',
                            resolve: {
                                $helpmates: function () {
                                    return {
                                        sp: res.data.availableSPList,
                                        jobId: jobs.jobData._id
                                    };
                                }
                            },
                            size: 'lg'
                        });
                    } else {
                        toastr.error("No Sp found.");
                    }
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(res.message);
                }
            });
        }
    }


    angular.module('jobs').controller('AssignHelpmateController', function ($scope, $uibModalInstance, $state, usSpinnerService, jobsServices, $helpmates, toastr) {

        var assign = this;

        assign.helpmates = $helpmates.sp;
        assign.jobId = $helpmates.jobId;

        assign.assignHelpmate = function (id) {
            if(id) {
                usSpinnerService.spin('spinner-1');
                var params = {
                    spId: id,
                    jobId: assign.jobId,
                    isAccepted: true
                };
            }
            else {

            }
            return jobsServices.assignHelpmate(params).then(function (response) {
                if (response.success == "1") {
                    usSpinnerService.stop('spinner-1');
                    $uibModalInstance.close();
                    $state.reload();
                    toastr.success("Job assigned to helpmate successfully.");
                } else {
                    usSpinnerService.stop('spinner-1');
                    toastr.error(response.message);
                }
            });
        };


    });


})();



