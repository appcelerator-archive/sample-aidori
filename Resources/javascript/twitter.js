Titanium.include('./application.js');
Titanium.include('./date_extensions.js');
Titanium.App.fireEvent('show_indicator',{});

var win = Titanium.UI.currentWindow;
var properties = Titanium.App.Properties;
var tableView;
var data = [];
var rowData = [];

Ti.App.fireEvent('show_indicator');

function buildData(tweet) {
	var row = Ti.UI.createTableViewRow();
  row.height = 'auto';
  row.hasChild = false;
  row.className = 'twitter';
  row.tweetId = tweet.id;
  row.tweetText = tweet.text;
  
  var nameLabel = Ti.UI.createLabel({text:tweet.from_user,id:'nameLabel'});
  row.add(nameLabel);
  
  var dateLabel = Ti.UI.createLabel({
   text:DateHelper.time_ago_in_words_with_parsing(tweet.created_at+""),
	id:'dateLabel'
  });
  row.add(dateLabel);
  
  var avatarView = Ti.UI.createView({id:'avatarView',borderRadius:4});
  
  var avatarImage = Ti.UI.createImageView({
	    image:tweet.profile_image_url,
	  	preventDefaultImage:true,
		id:'avatarImage'
  });
  
  avatarView.add(avatarImage);
  row.add(avatarView);
    
  var tweetLabel = Ti.UI.createLabel({
	  	text:(tweet.text.replace(/&amp;/g,"&"))+"\n\n",
		id:'tweetLabel'
  });
  row.add(tweetLabel);
  
  data.push(row);
  
  rowData.push({
    id:tweet.id,
    text:tweet.text
  });
};

function noNetworkAlert(){
    Ti.App.fireEvent('hide_indicator',{});
  	Titanium.UI.createAlertDialog({
  	  title:Ti.Locale.getString('twitter_no_network_title'),
  	  message:Ti.Locale.getString('twitter_no_network_msg')
  	}).show();	
};

function getTimeFromDate(dateString) {
	var hour = dateString.substring(11,13)*1;
	var min = dateString.substring(14,16);
	if(hour > 12) { hour = hour - 12; }
	return hour+':'+min;
};

function timeOfDay(hour) {
	if(hour > 11) {
		return "PM";
	} else {
		return "AM";
	}
};

function retrieveTwitterFeed() {
	var url = "http://search.twitter.com/search.json?q="+encodeURIComponent(TWITTER_ACCOUNT);
	var xhr = Ti.Network.createHTTPClient();
 
  	Ti.API.info(url);
	xhr.open("GET",url);
	xhr.onreadystatechange = function() {
	  Ti.API.info(this.readyState);
	  Ti.API.info(this.status);
    if (this.readyState == 4) {
			var tweets = eval('(' + this.responseText + ')');
			Ti.API.info(this.responseText);
			var results = tweets.results;

  		for(var index in results) {
    		if(results[index] != null) {
    		  try{
      			buildData(results[index]);
    		  } catch(ex) {
    		    Titanium.API.error(ex);
    		  }
    		}
  		}
			
			if(tableView == null) {
				tableView = Titanium.UI.createTableView({
					backgroundColor:'#5a5c64',
    			separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE,
    			separatorColor:'#444',
					data:data
				});
				
        win.add(tableView);
			} else {
				tableView.setData(data,{animationStyle:Ti.UI.iPhone.RowAnimationStyle.UP});
			}
      Titanium.App.fireEvent('hide_indicator',{});
		}
	};
	xhr.send();
};
 
var refreshButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.REFRESH});
refreshButton.addEventListener('click',function()	{
  if (!Ti.Network.online){
    Ti.App.fireEvent('hide_indicator',{});
	noNetworkAlert();
  } else {
    Ti.App.fireEvent('show_indicator',{});
    data = [];
    rowData = [];
    retrieveTwitterFeed();
  }
});

Titanium.UI.currentWindow.setLeftNavButton(refreshButton);

if (!Ti.Network.online){
  	Ti.App.fireEvent('hide_indicator',{});
	noNetworkAlert();
} else {
	retrieveTwitterFeed();
}

if(Ti.Platform.name == "android") {
  var menu = Ti.UI.Android.OptionMenu.createMenu();
  var refreshMenuItem = Ti.UI.Android.OptionMenu.createMenuItem({
      title : 'Refresh Tweets'
  });
  refreshMenuItem.addEventListener('click', function(){
    Titanium.App.fireEvent('show_indicator',{});
    data = [];
    rowData = [];
    retrieveTwitterFeed();
  });
  menu.add(refreshMenuItem);
  Ti.UI.Android.OptionMenu.setMenu(menu); 
}