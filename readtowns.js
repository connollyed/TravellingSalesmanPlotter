towns = new Array();
var cityCircle;
var map;

window.onload = function() {
	var fileInput = document.getElementById('fileInput');
	var fileDisplayArea = document.getElementById('fileDisplayArea');
	//google.maps.event.addDomListener(window, 'load', initialize);
	
	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var textType = /text.*/;

		if (file.type.match(textType)) {
			var reader = new FileReader();
            			
			reader.onload = function(e) {
			console.log(e);
			var text = reader.result;
			//fileDisplayArea.innerHTML = text;
				
			text = text.split(/\s+/);	
				
			// read town information into town object data literal
			for(var i=0;i<text.length;i=i+4){
				towns.push({
				ID: text[i],
				name: text[i+1],
				lat: text[i+2],
				lon: text[i+3]});
			}
			
			//Print out towns into fileDisplayArea DIV
			var text = "<h2> List of Towns </h2>";
			for(var i=0;i<towns.length;i++){
				text = text + towns[i].ID + " " + towns[i].name + " " + towns[i].lat + " " + towns[i].lon + "<br/>";
			}
			fileDisplayArea.innerHTML = text;
			map = initialize();
			displayRouteInput();
		}
        
		reader.readAsText(file);	
		
		//google.maps.event.addDomListener(window, 'load', initialize);
		
		} else {
			fileDisplayArea.innerText = "File not supported!"
		}
	});
}

// Called after getting list of towns
// Makes townInput textbox visible
function displayRouteInput(){
	var townInput = document.getElementById('townInput');
	townInput.style.display = "inline";
}

// Plot Route entered in textbox on map
function plotRoute(){
	var route = document.getElementById('routeText');
	route = route.value.split(/\./);
	
	for(var i=0;i<route.length;i++){
		route[i] = parseInt(route[i])-1;
	}
	var routeArray = new Array();
	for(var i=0;i<route.length+1;i++){
		var currentTown = towns[route[(i%route.length)]];
		
		routeArray.push(new google.maps.LatLng(currentTown.lat, currentTown.lon));
	}
	
	var TSProute = new google.maps.Polyline({
		path: routeArray,
		geodesic: true,
		strokeColor: '#000000',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	
	TSProute.setMap(map);
}

// Called by reset button, resets map and textbox
function reInit(){
	//clear textbox
	var routeText = document.getElementById('routeText');	
	routeText.value ="";
	
	
	map = initialize();
	displayRouteInput();
}

// Initialise Google Map and place Town Markers on map
function initialize() {
	// Create the map.
	var mapOptions = {
		zoom: 7,
		center: new google.maps.LatLng(53.3834,-8.21775),
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// Construct the circle for each value in towns.
	for (var i=0;i<towns.length;i++) {
		//console.log(typeof towns[i].name);
		var myLatLng = new google.maps.LatLng(towns[i].lat, towns[i].lon);
		
		var townCircle = {
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			map: map,
			center: myLatLng,
			radius: 2500
		};
    
		// Add the circle for this city to the map.
		cityCircle = new google.maps.Circle(townCircle);
	}
	return map;
}
	