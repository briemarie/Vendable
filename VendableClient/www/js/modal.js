angular.module('Vendable', ['ionic'])
.controller('VendableCtrl', function($scope, $ionicModal) {
  $ionicModal.fromTemplateUrl('name-list-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
});