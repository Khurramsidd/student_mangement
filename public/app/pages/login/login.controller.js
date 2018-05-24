( function () {
    angular.module('login').controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = [ '$scope', '$state', 'loginService', 'localStorageService', 'toastr' ];

    function loginCtrl ($scope, $state, loginService, localStorageService, toastr) {
        var login = this;

        login.signInUser = {};

        // access login
        login.login = function (data) {
            return loginService.authenticateUser(data).then(function (response) {
                if ( response.success == '1' ) {
                    localStorageService.set('user', response.data.account);
                    $scope.user = localStorageService.get('user');
                    toastr.success('Successfully logged into the system', 'Login Success!');
                    $scope.$emit('userLogin', { user: $scope.user });
                    $state.go('dashboard');
                } else {
                    if ( response.response == 401 ) {
                        $state.go('login');
                    }
                    toastr.error(response.message, 'Login Failed');
                }
            });
        };

        // registration
        login.register = function () {
            $state.go('signup');
        };

        console.log('Login Controller InIted');

    }

    angular.module('login').controller('SignOutController', SignOutController);

    SignOutController.$inject = [ '$scope', '$state', 'localStorageService', 'GlobalServices', 'logOutService' ];

    function SignOutController ($scope, $state, localStorageService, GlobalServices, logOutService) {
        checkCurrentUser();

        function checkCurrentUser () {
            return GlobalServices.currentUser().then(function (data) {
                if ( data.success === 1 ) {
                    var user = localStorageService.get('user');
                    if ( user !== null ) {
                        localStorageService.remove('user');
                    }
                    logOutService.logOutUser().then(function (res) {
                        if ( res.success === 1 ) {
                            $scope.user = null;
                            // $scope.$broadcast('userLogout', {user: $scope.user});
                            $scope.$emit('userLogout', { user: $scope.user });
                        }
                        $state.go('login');
                    });
                } else {
                    $state.go('login');
                }
            });
        }
    }

} )();



