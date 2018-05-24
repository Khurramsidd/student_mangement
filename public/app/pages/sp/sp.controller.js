/**
 * Created by Majid on 9/28/2017.
 */


( function () {
    angular.module('sp').controller('spMainController', spMainController);

    spMainController.$inject = [ '$scope', '$state', 'toastr' ];

    function spMainController ($scope, $state, toastr) {
        var spMain = this;
    }
} )();