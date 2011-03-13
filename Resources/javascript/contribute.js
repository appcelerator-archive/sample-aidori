
Ti.include('./application.js','./charity_data.js');
var cc ={win:Ti.UI.currentWindow};
	cc.tableView = Ti.UI.createTableView({
		backgroundColor:'#fff'
	});
	cc.win.add(cc.tableView);
		
	cc.getDataRow=function(charityItem,countItem){
		var row = Ti.UI.createTableViewRow({
			height:'auto',
			hasChild:true,
			className:'charity_' + countItem,  //Add unique to force new template
			name:charityItem.name,
			web_link:charityItem.web,
			phone_num:charityItem.phone_num,
			phone_text:charityItem.phone,
			address:charityItem.address,
			info_text:charityItem.info_text,
			isRowElement:true //hack for android touch event
		});
		
		var vwRow = Ti.UI.createView({
				layout:'horizontal',
				left:5,
				right:5,
				height:50,
				width:275,
				parm_name:'vwRow'
		});


		var vwCol1 = Ti.UI.createView({
			borderRadius:3,
			borderColor:'#000',
			borderWidth:1,
			backgroundColor:'#fff',
			height:48,
			layout:'vertical',
			top:2,
			right:5,
			width:75
		});
		
		var logoImg = Ti.UI.createImageView({
		    image:tweet.profile_image_url,
		  	preventDefaultImage:true,
			height:75,
			width:75
	    });
	
		vwCol1.add(logoImg);
		vwRow.add(vwCol1);
		
		var vwCol2 = Ti.UI.createView({
			width:30,
			height:50,
			layout:'vertical'
		});	

		var charityName = Ti.UI.createLabel({
			text:charityItem.name,
			top:0,
			color:'#000',
			height:50,
			textAlign:'left',
			width:120,
			font:{fontSize:14}
			});		
		vwCol2.add(charityName);
		
		vwRow.add(vwCol2);	
		
		row.add(vwRow);
		return 	row;
	};

	cc.getTableData=function(){
		var tableData =[];
		var itemCount = cc.charityData.orgInfo.length;
		Ti.API.info('itemCount=' + itemCount);
		for (var iLoop=0;iLoop<itemCount;iLoop++){
			Ti.API.info('iLoop=' + iLoop);
			tableData.push(cc.getDataRow(cc.charityData.orgInfo[iLoop],iLoop));
		}
					
	};
//-------------------------------
//	Events
//-------------------------------
cc.win.addEventListener('focus', function(){	
	cc.tableView.setData(cc.getTableData());
});
