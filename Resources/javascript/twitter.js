Ti.include('./application.js','./date_extensions.js','./keys.js');

var cc ={win:Ti.UI.currentWindow};
Ti.App.fireEvent('show_indicator');

(function(){
	cc.refreshButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.REFRESH});
	if (Ti.Platform.name != 'android') {
		Ti.UI.currentWindow.setLeftNavButton(cc.refreshButton);
		cc.configButton = Ti.UI.createButton({
			image: '../images/light_gear.png'
		});
		Ti.UI.currentWindow.setRightNavButton(cc.configButton);
	};
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
		// get saved hashtags:
		if(!Ti.App.Properties.hasProperty('hashtag1')){
			Ti.App.Properties.setString("hashtag1", HASHTAG1);
		}
		if(!Ti.App.Properties.hasProperty('hashtag2')){
			Ti.App.Properties.setString("hashtag2", HASHTAG2);
		}
		if(!Ti.App.Properties.hasProperty('hashtag3')){
			Ti.App.Properties.setString("hashtag3", HASHTAG3);
		}	
		var ht1 = Ti.App.Properties.getString("hashtag1", HASHTAG1);
		var ht2 = Ti.App.Properties.getString("hashtag2", HASHTAG3);
		var ht3 = Ti.App.Properties.getString("hashtag3", HASHTAG3);
		var ht4 = Ti.App.Properties.getString("hashtag4", '');
		
		//Make sure we've got at least one hashtag
		if((ht1.length==0)&&(ht2.length==0)&&(ht3.length==0)&&(ht4.length==0)){
			Ti.App.Properties.setString("hashtag1", HASHTAG1);
			ht1=HASHTAG1;
		}
	
		var hashTags = encodeURIComponent('#'+ht1);
		if (ht2 != '') {
			hashTags += ('&' + encodeURIComponent('#' + ht2));
		}
		if (ht3 != '') {
			hashTags += ('&' + encodeURIComponent('#' + ht3));
		}
		if (ht4 != '') {
			hashTags += ('&' + encodeURIComponent('#' + ht4));
		}
		var url = "http://search.twitter.com/search.json?q="+hashTags;
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
	
	// pop-up for twitter configuration (hashtags)
	// twConfigWrapper provides a semi-transparent "modal" background
	var twConfigWrapper = Ti.UI.createView({
		height:Ti.Platform.displayCaps.platformHeight,
		width:Ti.Platform.displayCaps.platformWidth,
		backgroundImage:'../images/75percentblack.png',
		visible:false
	});
	// twConfigView holds the fields and labels
	 var twConfigView = Ti.UI.createView({id:'twConfigView'});
	 var twConfigHeader = Ti.UI.createView({id:'twConfigHeader'});
	 var lbl_tw_header = Ti.UI.createLabel({id:'lbltwheader'});
	 twConfigHeader.add(lbl_tw_header);
	 var btn_twC_OK = Ti.UI.createButton({id:'btntwCOK'});
	 twConfigHeader.add(btn_twC_OK);
	 twConfigView.add(twConfigHeader);
	 var txt_hashtag1 = Ti.UI.createTextField({
	 	value:HASHTAG1,
	    returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		id:'txthashtag1'
	 });
	 twConfigView.add(txt_hashtag1);
	 var txt_hashtag2 = Ti.UI.createTextField({
	 	value:HASHTAG2,
		returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		id:'txthashtag2'
	 });
	 twConfigView.add(txt_hashtag2);
	 var txt_hashtag3 = Ti.UI.createTextField({
	 	value:HASHTAG3,
		returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		id:'txthashtag3'
	 });
	 twConfigView.add(txt_hashtag3);
	 var txt_hashtag4 = Ti.UI.createTextField({
		returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		id:'txthashtag4'
	 });
	 twConfigView.add(txt_hashtag4);
	 // set current values if they exist
	txt_hashtag1.value = Ti.App.Properties.getString("hashtag1", HASHTAG1);
	txt_hashtag2.value = Ti.App.Properties.getString("hashtag2", HASHTAG2);
	txt_hashtag3.value = Ti.App.Properties.getString("hashtag3", HASHTAG3);
	txt_hashtag4.value = Ti.App.Properties.getString("hashtag4", '');
	
	 btn_twC_OK.addEventListener('click', function() {
	 	Ti.App.Properties.setString("hashtag1", txt_hashtag1.value.replace(/\#/g,''));
	 	Ti.App.Properties.setString("hashtag2", txt_hashtag2.value.replace(/\#/g,''));
	 	Ti.App.Properties.setString("hashtag3", txt_hashtag3.value.replace(/\#/g,''));
	 	Ti.App.Properties.setString("hashtag4", txt_hashtag4.value.replace(/\#/g,''));
		twConfigWrapper.hide();
		Ti.App.fireEvent('show_indicator',{});
		cc.retrieveTwitterFeed();
	 });
	 twConfigView.add(btn_twC_OK);
	 twConfigWrapper.add(twConfigView);
	 cc.win.add(twConfigWrapper);
	 

	//--------------------------------------------
	//		Events
	//--------------------------------------------
if (Ti.Platform.name != 'android') {
	cc.refreshButton.addEventListener('click', function(){
		if (!Ti.Network.online) {
			Ti.App.fireEvent('hide_indicator', {});
			noNetworkAlert();
		}
		else {
			Ti.App.fireEvent('show_indicator', {});
			cc.retrieveTwitterFeed();
		}
	});
	
	cc.configButton.addEventListener('click', function(){
		twConfigWrapper.show();
	});
};

if(isAndroid()){
	Ti.Android.currentActivity.onCreateOptionsMenu = function(e) {
		var menu = e.menu;
		var wPage = Ti.UI.createWindow({  
			backgroundColor:'#fff',
			navBarHidden:true,
			fullscreen:false
		});
		var mTwitterRefresh = menu.add({title: Ti.Locale.getString('twitter_refresh') });
			mTwitterRefresh.setIcon('../../images/dark_refresh.png');
			mTwitterRefresh.addEventListener("click", function(e) {
			Ti.App.fireEvent('show_indicator',{});
			cc.retrieveTwitterFeed();								
		});
		var mTwitterConfig = menu.add({title: L("hashtags_droidmenu") });
			mTwitterConfig.setIcon('../../images/dark_gear.png');
			mTwitterConfig.addEventListener("click", function(e) {
				twConfigWrapper.show();
		});

	};
}

})();


