angular.module('intellimap')

.factory('DataCollectionService',
	['$ionicPlatform','$cordovaGeolocation','$cordovaDeviceMotion',
	function($ionicPlatform,$cordovaGeolocation,$cordovaDeviceMotion) {
		var frequency = 100,
		accelerationWatch,
		geoLocationWatch,
		dataPoints =[],
		apiData,
		currentLocation={},
		intervalTimer;

		return {
			initCollection:init,
			stopWatching:stopWatching
		}

		function init(){
			startAccelerationWatch();
			intervalTimer = setInterval(function(){
				apiData = dataPoints;
				dataPoints = [];
				console.log(JSON.stringify(apiData));
			},10000)
		}

		function startAccelerationWatch(){
			$ionicPlatform.ready(function(){
				accelerationWatch = $cordovaDeviceMotion.watchAcceleration({
					frequency:frequency
				});

				geoLocationWatch = $cordovaGeolocation.watchPosition({
				    timeout : 10000,
				    enableHighAccuracy: true
				});

				accelerationWatch.then(null,function(error){
					alert('An error occurred');
					alert(JSON.stringify(error));
				},function(result){
					var temp = {
						lat: currentLocation.lat,
						long: currentLocation.long,
						x: result.x,
						y: result.y,
						z: result.z,
						timestamp: result.timestamp
					}
					dataPoints.push(temp);
				});

				geoLocationWatch.then(null,function(error) {
					alert('An error occurred');
					alert(JSON.stringify(error));
			      },
			      function(position) {
			        var lat  = position.coords.latitude;
			        var long = position.coords.longitude;
					currentLocation.lat = lat;
					currentLocation.long = long;
			    });
			});
		}

		function stopWatching(){
			if(accelerationWatch){
				accelerationWatch.clearWatch();
			}
			if(geoLocationWatch){
				geoLocationWatch.clearWatch();
			}
			if(intervalTimer){
				clearInterval(intervalTimer);
			}
		}
}]);
