Ti.include('./application.js','./date_extensions.js','./keys.js');

var cc ={win:Ti.UI.currentWindow};
Ti.App.fireEvent('show_indicator');

(function(){
	cc.refreshButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.REFRESH});
	Ti.UI.currentWindow.setLeftNavButton(cc.refreshButton);
	cc.tableView = Ti.UI.createTableView({
		backgroundColor:'#5a5c64',
		separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE,
		separatorColor:'#444'
	});
	cc.win.add(cc.tableView);
	cc.buildData=function(tweet) {
		var row = Ti.UI.createTableViewRow({
			height:'auto',
			hasChild:false,
			className:'twitter',
			tweetId:tweet.id,
			tweetText:tweet.text
		});

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

	  return row;

	};

	cc.retrieveTwitterFeed=function() {
		var url = "http://search.twitter.com/search.json?q="+encodeURIComponent(TWITTER_ACCOUNT);
		var xhr = Ti.Network.createHTTPClient();
		var tableData =[];
	  	Ti.API.info(url);
		xhr.open("GET",url);
		xhr.onreadystatechange = function() {
		  Ti.API.info(this.readyState);
		  Ti.API.info(this.status);
		    if (this.readyState == 4) {
					var tweets = eval('(' + this.responseText + ')');
					Ti.API.debug(this.responseText);
					var results = tweets.results;

		  		for(var index in results) {
		    		if(results[index] != null) {
		    		  try{
		      			tableData.push(cc.buildData(results[index]));
		    		  } catch(ex) {
		    		    Ti.API.error(ex);
		    		  }
		    		}
		  		}

			cc.tableView.setData(tableData,{animationStyle:Ti.UI.iPhone.RowAnimationStyle.UP});
	      	Ti.App.fireEvent('hide_indicator',{});
			}
		};
		xhr.send();
	};



	if (!Ti.Network.online){
	  	Ti.App.fireEvent('hide_indicator',{});
		noNetworkAlert();
	} else {
		cc.retrieveTwitterFeed();
	}

	if(Ti.Platform.name == "android") {
/*
		var activity = Ti.Android.currentActivity;
		activity.onCreateOptionsMenu = function(e) {
			var menu = e.menu;
			var menuItem = menu.add({ title: L("twitter_refresh")});
			menuItem.addEventListner('click', function(e) {
				Ti.App.fireEvent('show_indicator',{});
				cc.retrieveTwitterFeed();								
			});
			menu.data[0] = menuItem;
		};
*/
	  var menu = Ti.UI.Android.OptionMenu.createMenu();
	  var refreshMenuItem = Ti.UI.Android.OptionMenu.createMenuItem({
	      title : Ti.Locale.getString('twitter_refresh')
	  });
	  refreshMenuItem.addEventListener('click', function(){
	    Ti.App.fireEvent('show_indicator',{});
	    cc.retrieveTwitterFeed();
	  });
	  menu.add(refreshMenuItem);
	  Ti.UI.Android.OptionMenu.setMenu(menu); 

	}

	//--------------------------------------------
	//		Events
	//--------------------------------------------
	cc.refreshButton.addEventListener('click',function()	{
	  if (!Ti.Network.online){
	    Ti.App.fireEvent('hide_indicator',{});
		noNetworkAlert();
	  } else {
	    Ti.App.fireEvent('show_indicator',{});
	    cc.retrieveTwitterFeed();
	  }
	});	
})();
