var win = Ti.UI.currentWindow;

/** initialize **/
var currentLat = 38.267154;
var currentLng = 140.870705;
var defaultLatDelta = 0.1;
var defaultLngDelta = 0.1;
var url = 'http://www.mountposition.co.jp/place_data.dat';
var dbName = 'map';

function getFitLocation(max_lat, max_lng, min_lat, min_lng){
	var average_lat = (max_lat + min_lat) / 2.0;
	var average_lng = (max_lng + min_lng) / 2.0;
	var calcLatitudeDelta = max_lat - min_lat;
	var calcLongitudeDelta = max_lng - min_lng;
	
	if(calcLatitudeDelta < defaultLatDelta){
		calcLatitudeDelta = defaultLatDelta;
	}
	
	if(calcLongitudeDelta < defaultLatDelta){
		calcLongitudeDelta = defaultLngDelta;
	}
	
	Ti.API.info({latitude:average_lat, longitude:average_lng, latitudeDelta:calcLatitudeDelta, longitudeDelta:calcLongitudeDelta});
	return {latitude:average_lat, longitude:average_lng, latitudeDelta:calcLatitudeDelta, longitudeDelta:calcLongitudeDelta};
}

function textSearch(search_str){
	
	var db = Ti.Database.open(dbName);
	var condition = '%' + search_str + '%';
	var db_rows = db.execute('select * from places where name like ? or detail like ?', condition, condition);
	var count = db_rows.getRowCount();
	
	var max_lat = 0;
	var min_lat = 0;
	var max_lng = 0;
	var min_lng = 0;
	var i = 0;
	var annotations = [];
	
	while(db_rows.isValidRow()){
		if(i == 0){
			max_lat = db_rows.fieldByName('lat');
			max_lng = db_rows.fieldByName('lng');
			min_lat = max_lat;
			min_lng = max_lng;
		}else{
			max_lat = (max_lat > db_rows.fieldByName('lat')) ? max_lat : db_rows.fieldByName('lat');
			max_lng = (max_lng > db_rows.fieldByName('lng')) ? max_lng : db_rows.fieldByName('lng');
			min_lat = (min_lat < db_rows.fieldByName('lat')) ? min_lat : db_rows.fieldByName('lat');
			min_lng = (min_lng < db_rows.fieldByName('lng')) ? min_lng : db_rows.fieldByName('lng');
		}
		
		var annotation = Ti.Map.createAnnotation({
			title:db_rows.fieldByName('name'),
			latitude:db_rows.fieldByName('lat'),
			longitude:db_rows.fieldByName('lng'),
			pincolor:Ti.Map.ANNOTATION_GREEN
		});
		
		annotations.push(annotation);
		db_rows.next();
		i++;
	}
	
	db_rows.close();
	db.close();
	
	if(count == 0){
		alert('nothing');
	}else {
		this.mapView.removeAllAnnotations();
		this.mapView.addAnnotations(annotations);
		if(count == 1){
			this.mapView.setLocation({latitude: max_lat,longitude: max_lng, latitudeDelta:defaultLatDelta, longitudeDelta:defaultLngDelta});
		}else{
			this.mapView.setLocation(getFitLocation(max_lat, max_lng, min_lat, min_lng));
		}
	}
}

var searchBar = Ti.UI.createSearchBar({
	barColor:'#000000',
	showCancel:true,
	height:40,
	top:0
});

searchBar.addEventListener('return', function(e)
{
	searchBar.blur();
	if(e.value.length == 0){
		this.createAnnotations();
	}else{
		textSearch(e.value);
	}
});

searchBar.addEventListener('cancel', function(e){searchBar.blur();});
win.add(searchBar);


var mapView = Ti.Map.createView({
	mapType: Ti.Map.STANDARD_TYPE,
	animate: true,
	regionFit: true,
	userLocation: true,
	region: {
		latitude: currentLat,
		longitude: currentLng,
		latitudeDelta: defaultLatDelta,
		longitudeDelta: defaultLngDelta
	},
	top: 40,
	left: 0
});

var actInd = Ti.UI.createActivityIndicator({
    style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
    width: 32,
    height: 32
  });
mapView.add(actInd);

/** XHR **/
var XHR = {
	getDataFromURL: function(url, callback, error_callback){
		if(Ti.Network.online	 ==	 false){ 
			error_callback({message:L('can_not_use_network')});
			return;
		}

		var xhr = Ti.Network.createHTTPClient();

		//Loading processing
		xhr.onreadystatechange = function(){
			switch (this.readyState) {
				case 1: // Open
					Ti.API.info('HTTP Open.');
					break;
				case 2: // Sent
					Ti.API.info('HTTP Sending...');
					break;
				case 3: // Receiving
					Ti.API.info('HTTP Receiving...');
					break;
				case 4: // Loaded
					Ti.API.info('HTTP Loaded.');
					break;
			}
		};

		//After processing
		xhr.onload = function(){
			var result = '';
			var error = null;
			try{
				result = JSON.parse(this.responseText);
			}catch(ex){
				Ti.API.info(ex);
				Ti.API.info(this.responseText);
				error = ex;
			}
			
			xhr.onreadystatchange = null;
			xhr.onload = null;
			xhr.onerror = null;
			xhr = null;
			
			if(error != null){
				error_callback(error);
			}else{
				callback(result);
			}
			return;
		};

		//Error processing
		xhr.onerror = function(e){
			xhr.onreadystatchange = null;
			xhr.onload = null;
			xhr.onerror = null;
			xhr = null;
			error_callback(e);
			return;
		};

		Ti.API.info('xhr open url:' + url);
		xhr.open("GET", url);
		xhr.send();
	}
};

/** create annotation from local db **/
function createAnnotations(){
	var db = Ti.Database.open(dbName);
	db.execute('create table if not exists places (id integer, name text, lat real, lng real, detail text)');
	var db_rows = db.execute('select * from places');
	var annotations = [];
	
	while(db_rows.isValidRow()){
		annotations.push({latitude:db_rows.fieldByName('lat'), 
						  longitude:db_rows.fieldByName('lng'), 
						  title:db_rows.fieldByName('name')});
		db_rows.next();
	}
	db_rows.close();
	db.close();
	mapView.removeAllAnnotations();
	mapView.userLocation = true;
	if(annotations.length == 0){
		alert(L('no_local_shelter_info'));
	}else{
		mapView.addAnnotations(annotations);
	}
}

/** sync remoto to local **/
function setData(data){
	var db = Ti.Database.open(dbName);
	db.execute('create table if not exists places (id integer, name text, lat real, lng real, detail text)');

	for(var i = 0; i < data.length; i++){
		var db_row = db.execute('select * from places where id = ?', data[i].id);

		if(db_row.isValidRow()){
			//update
			db.execute("update places set name = ?, lat = ?, lng = ?, detail = ? where id = ?", 
						data[i].name, data[i].lat, data[i].lng, data[i].description, data[i].id);
		}else{
			//insert
			db.execute('insert into places(id, name, lat, lng, detail) values(?, ?, ?, ?, ?)', 
						data[i].id, data[i].name, data[i].lat, data[i].lng, data[i].description);
		}
		db_row.close();
	}
	db.close();
	createAnnotations();
	actInd.hide();
}

/** sync error callback **/
function getXHRError(error){
	alert(L('can_not_use_network'));
	Ti.API.info(error);
	actInd.hide();
}


/** Get geolocation **/
if (Ti.Geolocation.locationServicesEnabled) {
  
	Ti.Geolocation.purpose = "Get current position";
	Ti.Geolocation.showCalibration = false;
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.distanceFilter = 100;
  
	Ti.Geolocation.getCurrentPosition(function(e) {
		currentLat = e.coords.latitude;
		currentLng = e.coords.longitude;
		mapView.setLocation({latitude:e.coords.latitude, longitude:e.coords.longitude});
	});
  
	Ti.Geolocation.addEventListener("location", function(e) {
		currentLat = e.coords.latitude;
		currentLng = e.coords.longitude;
		mapView.setLocation({latitude:e.coords.latitude, longitude:e.coords.longitude});
	});
  
} else {
  alert(L('can_not_get_geolocation'));
}

/** execute **/
createAnnotations();
win.add(mapView);


function geoDistance(lat1, lng1, lat2, lng2, precision) {
  var distance = 0;
  if ((Math.abs(lat1 - lat2) < 0.00001) && (Math.abs(lng1 - lng2) < 0.00001)) {
    distance = 0;
  } else {
    lat1 = lat1 * Math.PI / 180;
    lng1 = lng1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lng2 = lng2 * Math.PI / 180;
 
    var A = 6378140;
    var B = 6356755;
    var F = (A - B) / A;
 
    var P1 = Math.atan((B / A) * Math.tan(lat1));
    var P2 = Math.atan((B / A) * Math.tan(lat2));
 
    var X = Math.acos(Math.sin(P1) * Math.sin(P2) + Math.cos(P1) * Math.cos(P2) * Math.cos(lng1 - lng2));
    var L = (F / 8) * ((Math.sin(X) - X) * Math.pow((Math.sin(P1) + Math.sin(P2)), 2) / Math.pow(Math.cos(X / 2), 2) - (Math.sin(X) - X) * Math.pow(Math.sin(P1) - Math.sin(P2), 2) / Math.pow(Math.sin(X), 2));
 
    distance = A * (X + L);
    var decimal_no = Math.pow(10, precision);
    distance = Math.round(decimal_no * distance / 1) / decimal_no;   // kmに変換するときは(1000で割る)
  }
  return distance;
}

function setNearByAnnotation(){
	var db = Ti.Database.open(dbName);
	db_rows = db.execute('select * from places');
	
	var lat = 0;
	var lng = 0;
	var distance = 0;
	var i = 0;
	
	while(db_rows.isValidRow()){
		var tmp_dis = geoDistance(currentLat, currentLng, db_rows.fieldByName('lat'), db_rows.fieldByName('lng'), 5);
		if(i == 0){
			distance = tmp_dis;
			lat = db_rows.fieldByName('lat');
			lng = db_rows.fieldByName('lng');
		}else{
			if(distance >= tmp_dis){
				distance = tmp_dis;
				lat = db_rows.fieldByName('lat');
				lng = db_rows.fieldByName('lng');
			}
		}
		db_rows.next();
		i++;
	}
	db_rows.close();
	db.close();
	createAnnotations();
	mapView.setLocation({latitude:lat, longitude:lng});
}

/** toolbar **/
(function(){
	var flexSpace = Ti.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var currentPositionButton = Ti.UI.createButton({
		title:L('show_current_position_button_title'),
		style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
	});
	
	currentPositionButton.addEventListener('click', function(){
		createAnnotations();
		mapView.setLocation({latitude: currentLat,longitude: currentLng});
	});
	
	var nearbyButton = Ti.UI.createButton({
		title:'near by',
		style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
	});
	
	nearbyButton.addEventListener('click', function(){
		setNearByAnnotation();
	});
	
	var getPlacesButton = Ti.UI.createButton({
		title:L('synchronize_shelter_place'),
		style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
	});
	
	getPlacesButton.addEventListener('click', function(){
		actInd.show();
		XHR.getDataFromURL(url, setData, getXHRError);
	});
	
	var toolbar = Ti.UI.createToolbar({
		items:[currentPositionButton, flexSpace, nearbyButton, flexSpace, getPlacesButton],
		barColor:"#000",
		bottom:0
	});
	
	win.add(toolbar);
})();

/** win close **/
win.addEventListener('close', function(){
	Ti.Geolocation.removeEventListener('location');
});