$(document).ready(function(){
  bindEvents();
  getLocation();
  decideMap();
})


var startTracking = function(that) {

  var url = $(that).attr('href')
  walk = setInterval(function(){
    watch_id= navigator.geolocation.getCurrentPosition(
      // success
      function(position) {
        $.ajax({
          type: 'post',
          url: url+'?lat='+position.coords.latitude+'&lng='+position.coords.longitude
        }).done(function(response){
          console.log(response.path)
          drawLine(response.path)
          distance(response.distance)
          moveMarker(marker, response.path[1][0], response.path[1][1])
        })
      },

      //error
      function(error){
        console.log(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximunAge: 0
      }
    )

  }, 4000)
}

var stopTracking = function() {

  var url = $()
  clearInterval(walk);
}



var getLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(drawMap)
  }
  else {
    $('#message').text("Geolocation not supported")
  }
}

var distance = function(distance) {
  $('#dis').text(distance+'Km')
}

var getCoords = function(position) {
  lng = position.coords.longitude
  lat = position.coords.latitude
  $('#lng').text(position.coords.longitude)
  $('#lat').text(position.coords.latitude)
}

var drawMap = function(position){
  new GMaps({
    div: '#map-canvas',
    lat: position.coords.latitude,//parseFloat($('#lat').text()),
    lng: position.coords.longitude //parseFloat($('#lng').text())
  });
  getCoords(position)
  setMarker()
}

var setMarker = function() {
  marker = map.addMarker({
    lat: lat,
    lng: lng,
    title: 'Lima',
  });
}

var moveMarker = function(marker, lat, lng) {
  marker.setPosition({lat: lat, lng:lng})
}

var getPath = function(that) {

  var url = $(that).attr("href")
  $.ajax({
    type: 'get',
    url: url
  }).done(function(response) {
    drawLine(response)
    console.log(response)
     } )
}

var drawLine = function(path) {
  map.drawPolyline({
    path: path,
    strokeColor: '#131540',
    strokeOpacity: 0.6,
    strokeWeight: 6
  });
}
