angular.module('intellimap')

.controller('MapCtrl',['$scope','$ionicPlatform','$cordovaGeolocation',function($scope,$ionicPlatform,$cordovaGeolocation) {
	var styleArray = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}];
	var options = {timeout: 10000, enableHighAccuracy: true, maxAge: 0};
    var geoLocationWatch;
	$scope.path = [];
	var mapOptions = {
	  zoom: 18,
	  styles: styleArray,
	  disableDefaultUI: true,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
	var bump = {
          path: 'M8 48 L60 48 L56 36 L48 30 L20 30 L12 36 Z',
		  scale: 0.3,
		  strokeColor: '#3a3939',
		  strokeOpacity: 0.8,
		  strokeWeight: 2,
		  fillColor: '#6e6e6e',
		  fillOpacity: 0.9,
    };
	var bumpMarker = new google.maps.Marker({
          icon: bump,
          map: $scope.map,
		  animation: google.maps.Animation.DROP,
  		  draggable: false
    });
	var marker = new google.maps.Marker({
		map: $scope.map,
		animation: google.maps.Animation.DROP,
		icon: '/img/marker.png',
		draggable: false
	});

	var radius = new google.maps.Circle({
	  map: $scope.map,
	  radius: 150,
	  strokeColor: '#005ef9',
	  strokeOpacity: 0.5,
	  strokeWeight: 1,
	  fillColor: '#4285f4',
	  fillOpacity: 0.2,
	});
	radius.bindTo('center', marker, 'position');



 	$ionicPlatform.ready(function(){
        geoLocationWatch = $cordovaGeolocation.watchPosition(options);

        geoLocationWatch.then(null,function(error) {
            alert('Please check your connection');
          },
          function(position) {
              circle = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			  $scope.map.setCenter(circle);
			  marker.setPosition(circle);
			  var bumps = getCurrentBumps(position.coords.latitude, position.coords.longitude);
			  if(bumps && bumps.length > 0){
				  for(var i = 0; i < bumps.length; i++){
					  bumpMarker.setPosition(
						  new google.maps.LatLng(bumps[i].lat),
						  new google.maps.LatLng(bumps[i].lng)
					  );
				  }
			  }
		});
    });

	function getCurrentBumps(lat, lng){
		return [
			{lat: lat + 0.000003, lng: lng - 0.000004},
			{lat: lat + 0.000043, lng: lng + 0.000003},
			{lat: lat - 0.000001, lng: lng - 0.000002},
			{lat: lat + 0.000002, lng: lng - 0.000021},
			{lat: lat + 0.000024, lng: lng + 0.000003},
			{lat: lat - 0.000005, lng: lng - 0.000003},
			{lat: lat + 0.00005, lng: lng + 0.000003},
		];
	}
}]);
