var win = Ti.UI.currentWindow;

/** initialize **/
var currentLat = 38.267154;
var currentLng = 140.870705;
var url = 'http://www.mountposition.co.jp/place_data.dat';
var dbName = 'map';


var mapView = Ti.Map.createView({
	mapType: Ti.Map.STANDARD_TYPE,
	animate: true,
	regionFit: true,
	userLocation: true,
	region: {
		latitude: currentLat,
		longitude: currentLng,
		latitudeDelta: 0.2,
		longitudeDelta: 0.2
	},
	top: 0,
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
			error_callback({message:'オフラインのため、データを取得できません'});
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
	
	Ti.API.info(db_rows.getRowCount());
	
	while(db_rows.isValidRow()){
		Ti.API.info(db_rows.fieldByName('id'));
		annotations.push({latitude:db_rows.fieldByName('lat'), 
						  longitude:db_rows.fieldByName('lng'), 
						  title:db_rows.fieldByName('name')});
		db_rows.next();
	}
	db_rows.close();
	db.close();
	mapView.removeAllAnnotations();
	mapView.userLocation = true;
	mapView.addAnnotations(annotations);
}

/** sync remoto to local **/
function setData(data){
	var db = Ti.Database.open(dbName);
	db.execute('delete from places');
	db.execute('create table if not exists places (id integer, name text, lat real, lng real, detail text)');

	for(var i = 0; i < data.length; i++){
		var db_row = db.execute('select * from places where id = ?', data[i].id);
		Ti.API.info('id fetch:' + db_row.getRowCount());
		if(db_row.isValidRow()){
			//update
			db.execute('update places set(name = ?, lat = ?, lng = ?, detail = ?) where id = ?', 
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
	alert('通信エラーが発生しました。オフラインモードで実行します');
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
  alert('現在地が取得できませんでした');
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
		bottom:0
	});
	
	win.add(toolbar);
})();

/** win close **/
win.addEventListener('close', function(){
	Ti.Geolocation.removeEventListener('location');
});