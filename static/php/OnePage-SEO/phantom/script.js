var page = require('webpage').create();
var url = require('system').args[1] || '';

if(!url.length) {
    console.log('The provided URL was not parsable');
    phantom.exit();
}

page.onCallback = function(data){
    phantom.outputEncoding = "utf-8";
    console.log(page.content);

    setTimeout(function() {
        phantom.exit(0);
    }, 0);
};
page.open(url, function(status) {
    if('success' !== status) {
        phantom.exit(0);
    }
});