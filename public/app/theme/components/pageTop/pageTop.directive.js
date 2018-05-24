(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('pageTop', pageTop);

    /** @ngInject */
    function pageTop() {
        return {
            restrict: 'E',
            templateUrl: '../app/theme/components/pageTop/pageTop.html',
            controller: function ($scope, $state, $timeout, localStorageService, $location) {
                var socket = null;
                var checkUser = null;

                // doSocketConnect();
                function doSocketConnect() {
                    socket = io.connect(socketInfo.socketURL);
                    return;
                }

                connect();

                function connect() {
                    if (socket !== null) {
                        if ($location.$$path == '/login') {
                            socket.io.disconnect();
                            socket = null;
                        }
                    }
                    console.log('connect called');
                    checkUser = localStorageService.get("user");
                    if (socket == null && checkUser == null) {
                        console.log("socket disconnected");
                    } else if (socket == null && checkUser !== null) {
                        if (socket !== null) {
                            if (socket.connected == true && socket.disconnected == false && checkUser != null) {
                                console.log("socket connected");
                                socketOnConnected();
                            }
                        } else {
                            doSocketConnect();
                        }
                    } else if (socket.connected == true && checkUser == null) {
                        console.log("socket disconnected");
                        socket.io.disconnect();
                    } else if (checkUser != null) {
                        if (socket.connected == false) {
                            console.log("socket reconnecting....");
                            $timeout(connect, 5000);
                        } else if (socket.connected == true && socket.disconnected == false && checkUser != null) {
                            console.log("socket connected");
                            socketOnConnected();
                        }
                    }
                    $timeout(connect, 5000);
                }

                // socketOnConnected();
                function socketOnConnected() {
                    socket.on(socketInfo.adminRequest, function (data) {
                        console.log("job received...........................................");
                        $scope.$apply(function () {
                            $scope.socketNotification = true;
                            if ($state.current.name == 'notifications') {
                                $state.reload();
                            }

                        });
                    });
                }

                $scope.goToNotification = function () {
                    $scope.socketNotification = false;
                    $state.go('notifications');
                };
            }
        };
    }

})();