var baseurl = "http://masuidrive.jp/tmp/";

var download = function(path, callback) {
    var xhr = Ti.Network.createHTTPClient({
        onload: function(e){
            try {
                if(xhr.status==200) {
                    var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, path);
                    file.write(xhr.responseData);
                    if(callback) {
                        callback();
                    }
                }
            } catch (x) {
            }
        }
    });
    xhr.open("GET", baseurl+path);
    xhr.send();
};

var update_news = function() {
    download("news.json", function() {
        Titanium.App.fireEvent('update_news');
    });
};

var update_contribute = function() {
    download("contribute.json", function() {
        Titanium.App.fireEvent('update_contribute');
    });
};

var update_shelter = function() {
    Ti.API.info("update_shelter");
};

var check_contents = function() {
    var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "contents_versions.json");
    if(!file.exists()) {
        file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "data/contents_versions.json");
    }
    var current = JSON.parse(file.read());

    var xhr = Ti.Network.createHTTPClient({
        onload: function(e){
            try {
                if(xhr.status==200) {
                    var remote = JSON.parse(xhr.responseText);
                    if(current.news!=remote.news) {
                        update_news();
                    }
                    if(current.contribute!=remote.contribute) {
                        update_contribute();
                    }
                    if(current.shelter!=remote.shelter) {
                        update_shelter();
                    }
                    var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "contents_versions.json");
                    file.write(xhr.responseData);
                }
            } catch (x) {
            }
        }
    });
    
    xhr.open("GET", baseurl+"contents_versions.json");
    xhr.send();
    Titanium.API.info("Checking udpate");
};
check_contents();


if(Ti.Platform.osname == 'android') {
   Ti.Android.currentActivity.addEventListener('resume', function(e) {
       Ti.API.info('Caught resume event');  
       check_contents();
   });
}
else if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
    Ti.App.addEventListener('resume', function(e) {
        Ti.API.info('Caught resume event');  
        check_contents();
    });
}