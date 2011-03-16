Ti.include('geohash.js');
var win = Ti.UI.currentWindow;

/** initialize **/
var isAndroid = Ti.Platform.osname == 'android';
var currentLat = 38.267154;
var currentLng = 140.870705;
var currentMapLat = 0;
var currentMapLng = 0;
var defaultLatDelta = 0.1;
var defaultLngDelta = 0.1;
var currentLatDelta = defaultLatDelta;
var currentLngDelta = defaultLngDelta;

var url = 'http://s3-ap-northeast-1.amazonaws.com/yehara.tokyo/JapanQuake2011/shelter.db';

var dbName = 'map';
var dbFileName = 'map.db';
var regionState = false;
var searchState = false;

function calcHashLevel(delta){
	if(delta < 0.03){
		return 6;
	}else if(0.03 <= delta && delta < 0.2){
		return 5;
	}else if(0.2 <= delta && delta < 0.4){
		return 4;
	}else if(0.4 <= delta && delta < 5.0){
		return 3;
	}else{
		return 2;
	}
}

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
	bottom:40,
	left: 0
});

mapView.addEventListener('click', function(evt){
	var annotation = evt.annotation;
	if(!annotation.isSummary){
		var subWindow = Ti.UI.createWindow({
			backgroundColor:'#666666',
			backgroundImage:'../images/back.png',
			url:'map_detail.js',
			title:L('map_detail_title')
		});
	
		subWindow.prop = {title:annotation.title, detail:annotation.detail};
	
		if(!isAndroid){
			var closeButton = Ti.UI.createButton({
				title:'Done',
				style: Ti.UI.iPhone.SystemButtonStyle.DONE
			});
			closeButton.addEventListener('click', function(){subWindow.close();});
			subWindow.setRightNavButton(closeButton);
		}else{
			subWindow.navBarHidden = true;
		}
	
		isAndroid ? subWindow.open({fullscreen:true}) : subWindow.open({modal:true});
	}else{
		Ti.API.info({latitude:annotation.latitude, lonigude:annotation.longitude, latitudeDelta:0.1, longitudeDelta:0.1});
		mapView.setLocation({latitude:annotation.latitude, lonigude:annotation.longitude, latitudeDelta:0.1, longitudeDelta:0.1});
	}
});

var actInd = Ti.UI.createActivityIndicator({
    style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
	message:L('map_processing'),
    width: 32,
    height: 32
});
var actIndView = Ti.UI.createView({
	top:0,
	left:0,
	bottom:0,
	right:0,
	backgroundColor:'#000000',
	opacity:0.2
});
mapView.add(actInd);

/** create annotation from local db **/
/*
function createAnnotations(){
	var db = Ti.Database.open(dbName);
	db.execute('create table if not exists places (id integer, name text, lat real, lng real, detail text)');
	var db_rows = db.execute('select * from places');
	var annotations = [];
	
	while(db_rows.isValidRow()){
						
		var annotation = Ti.Map.createAnnotation({
							title:db_rows.fieldByName('name'),
							latitude:db_rows.fieldByName('lat'),
							longitude:db_rows.fieldByName('lng'),
							detail:db_rows.fieldByName('detail'),
							animate:true
		});
		
		if(isAndroid){
			annotation.pinImage = "../images/map-pin.png";
		}
		
		annotations.push(annotation);
		db_rows.next();
	}
	db_rows.close();
	db.close();
	mapView.removeAllAnnotations();
	mapView.userLocation = true;
	if(annotations.length == 0){
		alert(L('no_local_shelter_info'));
	}else{
		//mapView.addAnnotation(annotations);
		//Android not implement Ti.Map.addAnnotations
		for(var i = 0; i < annotations.length; i++){
			mapView.addAnnotation(annotations[i]);
		}
	}
}
*/

function getFitLocation(max_lat, max_lng, min_lat, min_lng){
	
	var average_lat = (parseFloat(max_lat) + parseFloat(min_lat)) / 2.0;
	var average_lng = (parseFloat(max_lng) + parseFloat(min_lng)) / 2.0;
	var calcLatitudeDelta = max_lat - min_lat;
	var calcLongitudeDelta = max_lng - min_lng;
	
	if(calcLatitudeDelta < defaultLatDelta){
		calcLatitudeDelta = defaultLatDelta;
	}
	
	if(calcLongitudeDelta < defaultLatDelta){
		calcLongitudeDelta = defaultLngDelta;
	}
	/*
	Ti.API.info('max_lat:' + max_lat);
	Ti.API.info('max_lng:' + max_lng);
	Ti.API.info('min_lat:' + min_lat);
	Ti.API.info('min_lng:' + min_lng);
	Ti.API.info('average_lat:' + average_lat);
	Ti.API.info('average_lng:' + average_lng);
	Ti.API.info('calcLatitudeDelta:' + calcLatitudeDelta);
	Ti.API.info('calcLongitudeDelta:' + calcLongitudeDelta);
	*/
	return {latitude:average_lat, longitude:average_lng, latitudeDelta:calcLatitudeDelta, longitudeDelta:calcLongitudeDelta};
}

function textSearch(search_str){
	searchState = true;
	var db = Ti.Database.open(dbName);
	var condition = '%' + search_str + '%';
	var db_rows = db.execute('select * from places where name like ? or detail like ?', condition, condition);
	var count = db_rows.getRowCount();
	if(count >= 100){
		searchState = false;
		actInd.hide();
		actIndView.hide();
		alert(L('search_result_overflow'));
		return;
	}
	
	var max_lat = 0.0;
	var min_lat = 0.0;
	var max_lng = 0.0;
	var min_lng = 0.0;
	var i = 0;
	var annotations = [];

	while(db_rows.isValidRow()){
		var lat = db_rows.fieldByName('lat');
		var lng = db_rows.fieldByName('lng');
		if(i == 0){
			max_lat = lat;
			max_lng = lng;
			min_lat = lat;
			min_lng = lng;
		}else{
			max_lat = (max_lat > lat) ? max_lat : lat;
			max_lng = (max_lng > lng) ? max_lng : lng;
			min_lat = (min_lat < lat) ? min_lat : lat;
			min_lng = (min_lng < lng) ? min_lng : lng;
			Ti.API.info('max_lat:' + max_lat + ',max_lng:' + max_lng + ',min_lat:' + min_lat + ',min_lng:' + min_lng);
		}
		
		var annotation = Ti.Map.createAnnotation({
			title:db_rows.fieldByName('name'),
			latitude:lat,
			longitude:lng,
			detail:db_rows.fieldByName('detail'),
			animate:true,
			isSummary:false
		});
		
		if(isAndroid){
			annotation.pinImage = "../images/map-pin.png";
		}else{
			annotation.pincolor = Ti.Map.ANNOTATION_GREEN;
		}
		
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
		//this.mapView.addAnnotations(annotations);
		//Android not implement Ti.Map.addAnnotations
		for(var j = 0; j < annotations.length; j++){
			mapView.addAnnotation(annotations[j]);
		}
		if(count == 1){
			mapView.setLocation({latitude: max_lat,longitude: max_lng, latitudeDelta:defaultLatDelta, longitudeDelta:defaultLngDelta});
		}else{
			mapView.setLocation(getFitLocation(max_lat, max_lng, min_lat, min_lng));
		}
	}
	actInd.hide();
	actIndView.hide();
}

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
			var result = null;
			var error = null;
			try{
				//Ti.API.info(this.responseData);
				//Ti.API.info(this.responseText);
				//result = JSON.parse(this.responseText);
				result = this.responseData;
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

function saveDBFile(blobData, callback){
	var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "data");
	if(!dir.exists()){
		dir.createDirectory();
	}
	var file = Ti.Filesystem.getFile(dir.nativePath, (dbName + '.db'));
	if(file.exists()){
		file.deleteFile();
	}
	file.write(blobData);
	Ti.API.info("saved file path: " + file.nativePath);
	
	var temp_db = Ti.Database.open(dbName);
	temp_db.remove();
	Ti.API.info('remove db:' + temp_db);
	temp_db.close();
	callback(file.nativePath);
}

/** sync remoto to local **/
/*
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
*/
function dbInstall(filePath){
	Ti.API.info('file:' + filePath);
	var db = Ti.Database.install(filePath, dbName);
	Ti.API.info('new_db:' + db);
	db.close();
	return filePath;
}

function dbFileInitialize(blobData){
	var filePath = saveDBFile(blobData, dbInstall);
	//db初期化処理後のメソッドコール
	//createAnnotations();
	actInd.hide();
	actIndView.hide();
}

/** sync error callback **/
function getXHRError(error){
	alert(L('can_not_use_network'));
	Ti.API.info(error);
	actInd.hide();
	actIndView.hide();
}



function createAnnotationByGeohash(lat, lng, latDelta, lngDelta){
	var geohash = encodeGeoHash(lat, lng);
	Ti.API.info('lat:' + latDelta + ',lng:' + lngDelta);
	var delta = (parseFloat(latDelta) + parseFloat(lngDelta)) / 2.0;
	var hashLevel = calcHashLevel(delta);
	Ti.API.info('geohash:'+ geohash + ',hashLevel:' + hashLevel + ',delta:' + delta);
	
	var db = Ti.Database.open(dbName);
	
	var annotations = [];
	if(hashLevel == 6 || hashLevel == 5){
		var db_rows = db.execute('select * from places where id in (select places_id from place_geohashes where geohash in(select geohash from geohash where geohash = ? and length = ?) group by places_id)', geohash.substring(0, hashLevel), hashLevel);
		Ti.API.info('count:' + db_rows.getRowCount());
		while(db_rows.isValidRow()){
			var annotation = Ti.Map.createAnnotation({
				title:db_rows.fieldByName('name'),
				latitude:db_rows.fieldByName('lat'),
				longitude:db_rows.fieldByName('lng'),
				hashLevel:hashLevel,
				detail:db_rows.fieldByName('detail'),
				geoHash:geohash,
				isSummary:false
			});
			if(isAndroid){
				annotation.pinImage = "../images/map-pin.png";
			}
			annotations.push(annotation);
			db_rows.next();
		}
		db_rows.close();
	}else{
		var db_rows = db.execute('select * from geohash where geohash like ? and length = ?', (geohash.substring(0, hashLevel) + '%'), 4);
		Ti.API.info('count:' + db_rows.getRowCount());
		while(db_rows.isValidRow()){
			var annotation = Ti.Map.createAnnotation({
				title:'Click to Zoom',
				latitude:db_rows.fieldByName('lat'),
				longitude:db_rows.fieldByName('lng'),
				hashLevel:hashLevel,
				isSummary:true,
				geoHash:geohash,
				pincolor:Titanium.Map.ANNOTATION_PURPLE
			});
			annotations.push(annotation);
			db_rows.next();
		}
		db_rows.close();
	}
	db.close();
	return annotations;
}


function showAnnotation(annotations){
	mapView.removeAllAnnotations();
	for(var i = 0; i < annotations.length; i++){
		mapView.addAnnotation(annotations[i]);
	}
	regionState = true;
}

/** Search bar **/
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
		searchState = false;
		var annotations = createAnnotationByGeohash(currentMapLat, currentMapLng, currentLatDelta, currentLngDelta);
		showAnnotation(annotations);
	}else{
		actInd.show();
		actIndView.show();
		textSearch(e.value);
	}
});

searchBar.addEventListener('cancel', function(){
	searchBar.blur();
	searchBar.value = '';
	searchState = false;
	var annotations = createAnnotationByGeohash(currentMapLat, currentMapLng, currentLatDelta, currentLngDelta);
	showAnnotation(annotations);
});

searchBar.addEventListener('cancel', function(e){searchBar.blur();});
win.add(searchBar);

/** Get geolocation **/
if (Ti.Geolocation.locationServicesEnabled) {
  
	Ti.Geolocation.purpose = "Get current position";
	Ti.Geolocation.showCalibration = false;
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.distanceFilter = 100;
  
	Ti.Geolocation.getCurrentPosition(function(e) {
		if (!e.success || e.error)
		{
			alert(L('can_not_get_geolocation'));
		}else{
			currentLat = e.coords.latitude;
			currentLng = e.coords.longitude;
			mapView.setLocation({latitude:e.coords.latitude, longitude:e.coords.longitude});
		}
		mapView.addEventListener('regionChanged', function(evt){
			currentLatDelta = evt.latitudeDelta;
			currentLngDelta = evt.longitudeDelta;
			currentMapLat = evt.latitude;
			currentMapLng = evt.longitude;
			Ti.API.info(evt);
			if(regionState && !searchState){
				regionState = false;
				var annotations = createAnnotationByGeohash(evt.latitude, evt.longitude, evt.latitudeDelta, evt.longitudeDelta);
				showAnnotation(annotations);
			}
		});
		regionState = true;
	});
  
	Ti.Geolocation.addEventListener("location", function(e) {
		currentLat = e.coords.latitude;
		currentLng = e.coords.longitude;
	});
  
} else {
  alert(L('can_not_get_geolocation'));
}

/** execute **/
win.add(mapView);
searchBar.blur();


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
	var geohash = encodeGeoHash(currentLat, currentLng);
	var sql = 'select * from places where id in (select places_id from place_geohashes where geohash in(select geohash from geohash where geohash = ? and length = ?) group by places_id)';
	//var hashLevel = 6;
	
	var db = Ti.Database.open(dbName);
	db_rows = null;
	
	for(var hashLevel = 6; hashLevel > 0; hashLevel--){
		db_rows = db.execute(sql, geohash.substring(0, hashLevel), hashLevel);
		if(db_rows.getRowCount() != 0){
			break;
		}else{
			db_rows.close();
			db_rows = null;
		}
	}
	
	if(db_rows == null){
		alert('Not Found');
		return;
	}
	
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
	//createAnnotations();
	mapView.setLocation({latitude:lat, longitude:lng, latitudeDelta:defaultLatDelta, longitudeDelta:defaultLngDelta});
	actInd.hide();
	actIndView.hide();
}


/** toolbar **/
(function(){
	
	var currentPositionButton = Ti.UI.createButton({
		title:L('show_current_position_button_title'),
		style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
	});
	
	currentPositionButton.addEventListener('click', function(){
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error)
			{
				alert(L('can_not_get_geolocation'));
				return;
			}else{
				currentLat = e.coords.latitude;
				currentLng = e.coords.longitude;
				mapView.setLocation({latitude:e.coords.latitude, longitude:e.coords.longitude});
			}
		});
	});
	
	var nearbyButton = Ti.UI.createButton({
		title:'near by',
		style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
	});
	
	nearbyButton.addEventListener('click', function(){
		actInd.show();
		actIndView.show();
		setNearByAnnotation();
	});
	
	var getPlacesButton = Ti.UI.createButton({
		title:L('synchronize_shelter_place'),
		style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
	});
	
	getPlacesButton.addEventListener('click', function(){
		actInd.show();
		actIndView.show();
		XHR.getDataFromURL(url, dbFileInitialize, getXHRError);
	});
	

	if(isAndroid){
		var toolView = Ti.UI.createView({
			bottom:0,
			left:0,
			right:0,
			height:40,
			backgroundColor:'#999999'
		});
		currentPositionButton.top = 5;
		currentPositionButton.bottom = 5;
		currentPositionButton.left = 5;
		currentPositionButton.width = 100;
		currentPositionButton.font = {fontSize:10};
		toolView.add(currentPositionButton);
		
		nearbyButton.top = 5;
		nearbyButton.bottom = 5;
		nearbyButton.width = 80;
		nearbyButton.left = 110;
		nearbyButton.font = {fontSize:10};
		toolView.add(nearbyButton);
		
		getPlacesButton.top = 5;
		getPlacesButton.bottom = 5;
		getPlacesButton.width = 120;
		getPlacesButton.right = 5;
		getPlacesButton.font = {fontSize:10};
		toolView.add(getPlacesButton);
		
		win.add(toolView);
	}else{
		var flexSpace = Ti.UI.createButton({
			systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		var toolbar = Ti.UI.createToolbar({
			items:[currentPositionButton, flexSpace, nearbyButton, flexSpace, getPlacesButton],
			bottom:0
		});
		win.add(toolbar);
	}
})();

win.add(actIndView);
actIndView.hide();
/** win close **/
win.addEventListener('close', function(){
	Ti.Geolocation.removeEventListener('location');
});