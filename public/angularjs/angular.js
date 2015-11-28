var mapsApp = angular.module('myMap', ['ngRoute']);
				mapsApp.controller('mapsController', function($timeout,$compile,$rootScope,$scope,$http,$route, $location, $routeParams) {
				//google.maps.event.addDomListener(window, 'load', initialize);
				var distanceLimit = 500; //in meters
				var numberRandomPoints = 5;
				var mapZoomLevel = 16;
				var locationindex = 0;
				//to change location of car to source location
				var newSource;
				var markers=[];
				var p1,p2;
				//$rootScope.json=[];
				$scope.json=[];
				$scope.show="Sangeetha";
					$http({
			            method: 'POST',
			            url: '/selectDriver',
			         }).success(function(output){
			            if(output.statusCode == 200)
			            {
			            	var item=output.D_Firstname;
			            	console.log("Inside success");
			            	for(var i=0;i<item.length;i++)
			            	{
			            		//$rootScope.execute=1;
			            		console.log(item.length);
			            		
			            		//rootScope
			            		$scope.json[i]=
								             {
								                 "LastName": output.D_Lastname[i],
								                 "FirstName": output.D_Firstname[i],
								                 "PhoneNo": output.D_Phone[i],
								                 "Driver_ID": output.Driver_ID[i],
								                 "CarDetails": output.D_CarDetails[i],
								                 "Rating": output.D_Avg_Rating[i],
								                 "video":output.Video[i],
								                 "id":i+1//to identify the marker 
								             };
								           
				            	//console.log($rootScope.json);
			            	}
			            	createRandomMapMarkers(map, mappoints);
			            }
			        }).error(function(error){
			        	console.log("error");
			        });	
		
			  var infowindow = new google.maps.InfoWindow({
			    content: ""
			  });
			  
			  
				var iconBase = new google.maps.MarkerImage('uber.png',null,null,null,new google.maps.Size(42, 68));
				var myLatlng = new google.maps.LatLng(37.335270, -121.880669);  
				//function initialize() {
					var mapcenter = new google.maps.LatLng(parseFloat(myLatlng.lat()),parseFloat(myLatlng.lng()));
					var mapOptions = {
										zoom: 17,
										center: mapcenter,
										mapTypeId: google.maps.MapTypeId.ROADMAP
									};

					var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
					var mappoints = generateMapPoints(myLatlng, distanceLimit, numberRandomPoints);
					//createRandomMapMarkers(map, mappoints);
					var marker2;
				
					//Create markers for the randomly generated points
						function createRandomMapMarkers(map, mappoints) {
								for (var i = 0; i < mappoints.length; i++) {
									
								var link="#/driverProfile/:"+$scope.json[i].FirstName;
								var data='<div id="driverDetails">'+
								'<h5><b> Driver Name: '+$scope.json[i].FirstName+' '+$scope.json[i].LastName+'</h5></b>'+
								'<h6><b> Phone No: '+$scope.json[i].PhoneNo+'</h6></b>'+
								'<h6><b> Car Details: '+$scope.json[i].CarDetails+'</h6></b>'+
								'<h6><b> Rating:'+$scope.json[i].Rating+'</h6></b>'+
								'<br>'+
								'<video controls="" style="width:400px;height:200px;" preload="yes">' +
							    '<source src="'+$scope.json[i].video+'" type="video/webm;">' +
							    '</video>'+
							    '<br>'+
							    '<br>'+
							    '<button type="submit" id="btnColor" ng-click="confirmDriver('+i+')">Confirm Driver</button>'+
							    '</div>';
								
								//Map points without the east/west adjustment
								var newmappoint = new google.maps.LatLng(parseFloat(mappoints[i].latitude),parseFloat( mappoints[i].longitude));
								marker2 = new google.maps.Marker({
														position:newmappoint,
														map: map,
														icon:iconBase,
														title: data,
														zIndex: 2
													});
								markers.push(marker2);
								var d=$compile(data)($scope);
								bindInfoWindow(marker2, map, infowindow, d[0]);
								//bindInfoWindow(marker2, map, infowindow);
							}
						};
		$scope.confirmDriver=function(i){
			//markers[i] newimage
			//flag
			//$compile
			//bindinfoinfo
			 $timeout(function(){
				 alert("value "+i);
				 alert(newSource.lat());
				 markers[i].setMap(null);
				 alert("Reachng Destination");
				 markers[i]=new google.maps.Marker({
						position:newSource,
						map: map,
						icon:iconBase,
						title: "Reached Customer's location",
						zIndex: 2
					});
				 $scope.moveToDest(i);
				 },6000);
			
		};
		
		$scope.moveToDest=function(i){
			//insert into rides
			$timeout(function(){
				markers[i].setMap(null);
				markers[i]=new google.maps.Marker({
				position:p2,
				map: map,
				icon:iconBase,
				title: "Reached Destination Location",
				zIndex: 2
			});
				var place2 = searchBox2.getPlace();
				//when place has been found
				if (place2.geometry) {
				  marker.setOptions({
					title: place2.name,
					position: place2.geometry.location
				  });
				  if (place2.geometry.viewport) {
					marker.getMap().fitBounds(place2.geometry.viewport);
				  } else {
					marker.getMap().setCenter(place2.geometry.location);
				  }
				   
				}
				else {
				  marker.setOptions({
					title: null
				  });
				  alert('place not found');
				}
			
			},6000);
		
		};

		function bindInfoWindow(marker2, map, infowindow, description){
			 marker2.addListener('click', function() {
			        infowindow.setContent(description);
			        infowindow.open(map, this);
			    });
		}
		
    
		function generateMapPoints(center, distance, amount) {
			var mappoints = [];
			clearMarkers();
			for (var i=0; i<amount; i++) {
				
				mappoints.push(randomGeo(center, distance));
			}
			return mappoints;
		}

		//Create random lat/long coordinates in a specified radius around a center point
		function randomGeo(center, radius) {
			var y0 = center.lat();
			var x0 = center.lng();
			var rd = radius / 111300; //about 111300 meters in one degree

			var u = Math.random();
			var v = Math.random();

			var w = rd * Math.sqrt(u);
			var t = 2 * Math.PI * v;
			var x = w * Math.cos(t);
			var y = w * Math.sin(t);

			//Adjust the x-coordinate for the shrinking of the east-west distances
			var xp = x / Math.cos(y0);

			var newlat = y + y0;
			var newlon = x + x0;
			var newlon2 = xp + x0;

			return {
				'latitude': newlat.toFixed(5),
				'longitude': newlon.toFixed(5),
				'longitude2': newlon2.toFixed(5),
				'distance': distance(center.lat(), center.longitude, newlat, newlon).toFixed(2),
				'distance2': distance(center.lng(), center.longitude, newlat, newlon2).toFixed(2),
			};
		}


		function distance(lat1, lon1, lat2, lon2) {
			var R = 6371000;
			var a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos((lon2 - lon1) * Math.PI / 180)) / 2;
			return R * 2 * Math.asin(Math.sqrt(a));
		}

		  var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			draggable: true,
			
		  });
		  



		  //set the value of the hidden inputs when the position changes
		  google.maps.event.addListener(marker, 'position_changed', function() {
			var position_changed=1;
			document.getElementById('latitude').value = this.getPosition().lat();
			document.getElementById('longitude').value = this.getPosition().lng();
			var myLatlng = new google.maps.LatLng(parseFloat(document.getElementById('latitude').value),parseFloat(document.getElementById('longitude').value ));
			p1=new google.maps.LatLng(parseFloat(document.getElementById('latitude').value),parseFloat(document.getElementById('longitude').value ));
			var mappoints = generateMapPoints(myLatlng, distanceLimit, numberRandomPoints);
			/*if(position_changed==1)
			{	
				$http({
		            method: 'POST',
		            url: '/selectDriver',
		         }).success(function(output){
		            if(output.statusCode == 200)
		            {
		            	var item=output.D_Firstname;
		            	console.log("Inside success");
		            	for(var i=0;i<item.length;i++)
		            	{
		            		//$rootScope.execute=1;
		            		console.log(item.length);
		            		$scope.json[i]=
							             {
							                 "LastName": output.D_Lastname[i],
							                 "FirstName": output.D_Firstname[i],
							                 "PhoneNo": output.D_Phone[i],
							                 "Driver_ID": output.Driver_ID[i],
							                 "CarDetails": output.D_CarDetails[i],
							                 "Rating": output.D_Avg_Rating[i],
							                 "video":output.Video[i],
							                 "id":i+1//to identify the marker 
							             };
							           
			            	console.log($scope.json);
		            	}
		            	createRandomMapMarkers(map, mappoints);
		            }
		        }).error(function(error){
		        	console.log("error");
		        });	
				createRandomMapMarkers(map, mappoints); 
		  }*/
			//11/26/2015
			createRandomMapMarkers(map, mappoints); 
		  });


				// Create an Autocomplete and link it to the UI element.
				var input= /** @type {HTMLInputElement} */ (
				document.getElementById('pac-input'));
				map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
			  
			  
				// Create an Autocomplete and link it to the UI element.
				var input2= /** @type {HTMLInputElement} */ (
				document.getElementById('pac-input2'));
				map.controls[google.maps.ControlPosition.TOP_CENTER].push(input2);
			  
				var input3= /** @type {HTMLInputElement} */ (
						document.getElementById('pac-input3'));
						map.controls[google.maps.ControlPosition.TOP_CENTER].push(input3);
						
				var searchBox = new google.maps.places.Autocomplete(
				/** @type {HTMLInputElement} */
				(input), {
				  types: ['geocode']
				});


				var searchBox2 = new google.maps.places.Autocomplete(
				/** @type {HTMLInputElement} */
				(input2), {
				  types: ['geocode']
				});
				
				google.maps.event.addListener(searchBox2,'place_changed', function() {
				var geocoder = new google.maps.Geocoder();
				$scope.show=1;
				var address = document.getElementById("pac-input2").value;
				geocoder.geocode( { 'address': address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK)
				  {
				  //alert(results[0].geometry.location.lat(),results[0].geometry.location.lng());
				  p2=new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());
				}
			});
				
				});
				
				
			  // Listen for the event fired when the user selects an item from the
			  // pick list. Retrieve the matching places for that item.
			  google.maps.event.addListener(searchBox,'place_changed', function() {
				var place = this.getPlace();
				//when place has been found
				if (place.geometry) {
				  marker.setOptions({
					title: place.name,
					position: place.geometry.location
				  });
				  if (place.geometry.viewport) {
					marker.getMap().fitBounds(place.geometry.viewport);
				  } else {
					marker.getMap().setCenter(place.geometry.location);
				  }
				  newSource=new google.maps.LatLng(document.getElementById('latitude').value, document.getElementById('longitude').value);
				  //alert('latitude of src box '+document.getElementById('latitude').value);
				  //alert('longitude of src box '+document.getElementById('longitude').value);
				   
				}
				//otherwise
				else {
				  marker.setOptions({
					title: null
				  });
				  alert('place not found');
				}
			  });

				
				
			  // Bias the SearchBox results towards places that are within the bounds of the
			  // current map's viewport.
			  google.maps.event.addListener(map, 'bounds_changed', function() {
				
				var bounds = map.getBounds();
				searchBox.setBounds(bounds);
			  });
			  
			  
			  
			  
			  //Destroy all markers
			function clearMarkers() {
				for (var i = 0; i < markers.length; i++) {
					markers[i].setMap(null);
				}
				markers = [];
			}

			$('#location_switch').change(function() {
				var newlocation = $(this).val();
				
				clearMarkers();

				mapcenter = new google.maps.LatLng(locations[newlocation].latitude, locations[newlocation].longitude);
				map.panTo(mapcenter);
				centermarker = addCenterMarker(mapcenter, locations[newlocation].name + '<br>' + locations[newlocation].latitude + ', ' + locations[newlocation].longitude);
				mappoints = generateMapPoints(locations[newlocation], distanceLimit, numberRandomPoints);

				//Draw default items
				currentcircle.setMap(null);
				drawRadiusCircle(map, centermarker, distanceLimit);
				createRandomMapMarkers(map, mappoints);
			});
			  

			 
			//}

			 

			$scope.calculate=function(){

				if(p1===undefined && p2===undefined)	
				{
				alert("Enter the Source and Destination");
				}
				//console.log("distance"+distance);
				else
				{
				var distance=(google.maps.geometry.spherical.computeDistanceBetween(p1, p2)/1000).toFixed(2);
				var travelTime= 15;
				var baseFare=1.95;
				var safeRidesFee=1.35;
				var fare=(baseFare+safeRidesFee+(1.10*distance)+(0.20*travelTime)).toFixed(2);
				alert('Fare '+fare +'$');
				$scope.estimateFare=fare;
				}
			};
			$scope.signIn = function() {
				$http({
		            method: 'POST',
		            url: '/login',
		            data: { "email": $scope.email, "password": $scope.password }
		            
		         }).success(function(response){
		            if(response.statusCode == 200)
		            {
		            	console.log("Inside success");
		            }
		        }).error(function(error){
		        });
		    };
});

	mapsApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		 
	  $routeProvider
	    .when('/',{
	  	   
	      templateUrl: '/partials/map_1.ejs',
	      controller: 'mapsController'
	    })
	    .when('/driverProfile/:drivername',{
	  	   
	      templateUrl: 'partials/driverProfile.ejs',
	      controller: ''
	    })
	    .otherwise({ redirectTo: "/" });
	  
	    }]);
