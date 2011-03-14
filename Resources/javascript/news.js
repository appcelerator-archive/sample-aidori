Titanium.include('./keys.js');
Titanium.include('./application.js');

var win = Ti.UI.currentWindow;

Ti.App.fireEvent('show_indicator');

var data = [
    {title:'All content', controller: '', rss:''},
    {title:'BBC - English', controller: './feedreader.js', rss:'feed://feeds.bbci.co.uk/news/world/asia_pacific/rss.xml'},
    //{title:'Linux.com original content', controller: '', rss:''},
    {title:'BBC - Video', controller: './feedreader.js', rss:'http://feeds.bbci.co.uk/news/video_and_audio/news_front_page/rss.xml'}
];

var template = {
    selectedBackgroundColor:'#fff',
    backgroundColor:'#ffffff',
    rowHeight:100,
    layout:[
        {type:'image', left:10, top:5, width:50, height:50, name:'photo'},
        {type:'text', fontSize:16, fontWeight:'bold', fontFamily:'Arial', left:70, top:2, width:200, height:30, color:'#000000', name:'user'},
        {type:'image', right:5, top:35, width:36, height:34, name:'button'},
   ]
};

var tableView = Titanium.UI.createTableView({
    data:data,
    template:template
});

// Create tableView row event listener
tableView.addEventListener('click', function (e) {
    if (e.rowData.controller) {
        Ti.API.info('click fired: ' + e.rowData.title + ' ' + e.rowData.controller);
        var win = Titanium.UI.createWindow({
            url:e.rowData.controller,
            title:e.rowData.title
        });
        win.rss = e.rowData.rss;
        Titanium.UI.currentTab.open(win,{animated:true});
    }
});

Titanium.UI.currentWindow.add(tableView);

Ti.App.fireEvent('hide_indicator');
