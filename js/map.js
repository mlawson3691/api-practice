var apiKey = require('./../.env').apiKey;

function Map() {
  this.countries = ["Afghanistan","Albania","Algeria","Angola","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Chad","Chile","China","Colombia","Congo","Costa Rica","Cote D Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Greenland","Guatemala","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Mali","Mexico","Monaco","Mongolia","Morocco","Mozambique","Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];
  this.score = 0;
  this.userGuess = "";
  this.answer = "";
}


Map.prototype.randomCountry = function() {
  var length = this.countries.length;
  var random = Math.floor(Math.random() * length);
  this.answer = this.countries[random];
};

Map.prototype.locateUser = function() {
  var _this = this;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      _this.map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 2,
        styles: [
          {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
          {elementType: 'labels.text.fill', stylers: [{visibility: 'off'}]},
          {elementType: 'labels.text.stroke', stylers: [{visibility: 'off'}]},
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{color: '#000000'}]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{color: '#ebe3cd'}]
          },
          {
            featureType: 'poi',
            stylers: [{visibility: 'off'}]
          },
          {
            featureType: 'road',
            stylers: [{visibility: 'off'}]
          },
          {
            featureType: 'transit',
            stylers: [{visibility: 'off'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{color: '#0077b3'}]
          },
        ]
      });

      _this.map.setOptions({ draggableCursor: 'url("/../img/cursor.png"), auto' });

      _this.map.addListener("click", function (event) {
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        $.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + apiKey).then(function(response){
          response.results["0"].address_components.forEach(function(item) {
            if (item.types.includes('country')) {
              _this.userGuess = item.long_name;
            }
          });
          if (_this.answer.toLowerCase() === _this.userGuess.toLowerCase()) {
            _this.score ++;
            $('#score').text(_this.score);
            $('#instruction').text("Good job! You are a real genius! Try it again!");
            _this.randomCountry();
            $('#country').html(_this.answer);
          } else {
            $('#instruction').text("Sorry, game over! That's " + _this.userGuess + "! Play again?");
            $('#next').show();
            var markerPosition;
            $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + _this.answer + '&key=' + apiKey).then(function(response){
              markerPosition = response.results["0"].geometry.location;
              _this.marker = new google.maps.Marker({
                position: markerPosition,
                map: _this.map,
                icon: '/img/pin.png'
              });
              _this.map.setCenter(markerPosition);
              _this.map.setZoom(4);
            });
          }
        });
      });


    }, function(error) {
      $('#map').text(error);
    });
  } else {
    $('#map').text('Please enable location access in your browser.');
  }
};

exports.mapModule = Map;
