Vendable.run('VendableCrl',function($scope,$cordovaSplashscreen) {
  $cordovaSplashscreen.show();
  setTimeout(function() {
    $cordovaSplashscreen.hide()
  }, 5000)
})