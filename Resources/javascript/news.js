Titanium.include('./keys.js');
Titanium.include('./application.js');

var win = Ti.UI.currentWindow;

Ti.App.fireEvent('show_indicator');


var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "news.json");
if(!file.exists()) {
   file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "data/news.json");
}
var data = JSON.parse(file.read());

var template = {
    selectedBackgroundColor: '#000',
    backgroundColor: '#000',
    rowHeight: 100,
    layout: [
        {type:'image', left:10, top:5, width:50, height:50, name:'photo'},
        {type:'text', fontSize:16, fontWeight:'bold', fontFamily:'Arial', left:70, top:2, width:200, height:30, color:'#000000', name:'user'},
        {type:'image', right:5, top:35, width:36, height:34, name:'button'}
   ]
};

var tableView = Titanium.UI.createTableView({
    data: data,
    template: template
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

Ti.App.addEventListener('update_news', function() {
    var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "news.json");
    var data = JSON.parse(file.read());
    tableView.setData(data);
});
