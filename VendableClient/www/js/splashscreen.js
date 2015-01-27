Vendable.controller('VendableCtrl', function($scope, $cordovaSplashscreen) {

  $cordovaSplashscreen.show();

});

Vendable.run(function($cordovaSplashscreen) {
  setTimeout(function() {
    $cordovaSplashscreen.hide()
  }, 5000)
})