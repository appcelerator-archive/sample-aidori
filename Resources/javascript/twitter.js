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
  
  var nameLabel = Ti.UI.createLabel({
   color:'#fff',
   font:{fontSize:13, fontWeight:'bold'},
   text:tweet.from_user,
   top:8,
   left:68,
   width:120,
   height:16,
   textAlign:'left'
  });
  row.add(nameLabel);
  
  var dateLabel = Ti.UI.createLabel({
   color:'#eee',
   font:{fontSize:10, fontWeight:'normal'},
   text:DateHelper.time_ago_in_words_with_parsing(tweet.created_at+""),
   top:8,
   left:198,
   width:110,
   height:16,
   textAlign:'right'
  });
  row.add(dateLabel);
  
  var avatarView = Ti.UI.createView({
  	top:10,
  	left:10,
  	width:48,
  	height:48,
  	borderRadius:4
  });
  
  var avatarImage = Ti.UI.createImageView({
    url:tweet.profile_image_url,
  	top:0,
  	left:0,
  	width:48,
  	height:48,
  	preventDefaultImage:true
  });
  
  avatarView.add(avatarImage);
  row.add(avatarView);
    
  var tweetLabel = Ti.UI.createLabel({
  	color:'#fff',
  	font:{fontSize:14, fontWeight:'normal'},
  	text:(tweet.text.replace(/&amp;/g,"&"))+"\n\n",
  	top:30,
  	left:68,
  	width:236,
  	height:'auto',
  	textAlign:'left'
  });
  row.add(tweetLabel);
  
  data.push(row);
  
  rowData.push({
    id:tweet.id,
    text:tweet.text
  });
}

function getTimeFromDate(dateString) {
	var hour = dateString.substring(11,13)*1;
	var min = dateString.substring(14,16);
	if(hour > 12) { hour = hour - 12; }
	return hour+':'+min;
}

function timeOfDay(hour) {
	if(hour > 11) {
		return "PM";
	} else {
		return "AM";
	}
}

function retrieveTwitterFeed() {
	var url = "http://search.twitter.com/search.json?q="+encodeURIComponent(TWITTER_ACCOUNT);
	var xhr = Titanium.Network.createHTTPClient();
 
  Titanium.API.info(url);
	xhr.open("GET",url);
	xhr.onreadystatechange = function() {
	  Titanium.API.info(this.readyState);
	  Titanium.API.info(this.status);
    if (this.readyState == 4) {
			var tweets = eval('(' + this.responseText + ')');
			Titanium.API.info(this.responseText);
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
				tableView.setData(data,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.UP});
			}
      Titanium.App.fireEvent('hide_indicator',{});
		}
	};
	xhr.send();
}
 
var refreshButton = Titanium.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.REFRESH});
refreshButton.addEventListener('click',function()	{
  if (Titanium.Network.online == false){
    Titanium.App.fireEvent('hide_indicator',{});
  	Titanium.UI.createAlertDialog({
  	  title:"Connection Required",
  	  message:"We cannot detect a network connection.  You need an active network connection to be able to continue using Nature Nearby features."
  	}).show();
  } else {
    Titanium.App.fireEvent('show_indicator',{});
    data = [];
    rowData = [];
    retrieveTwitterFeed();
  }
});
Titanium.UI.currentWindow.setLeftNavButton(refreshButton);

if (Titanium.Network.online == false){
  Titanium.App.fireEvent('hide_indicator',{});
	Titanium.UI.createAlertDialog({
	  title:"Connection Required",
	  message:"We cannot detect a network connection.  You need an active network connection to be able to continue using Nature Nearby features."
	}).show();
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