require.config({
  shim: {
    'underscore' : { exports : '_' },
    'backbone' : { deps : ['underscore'], exports : 'Backbone' },
    'handlebars' : { exports : 'Handlebars' }
  },

  paths: {
    'jquery': 'scripts/vendor/jquery.min',
    'underscore': 'scripts/vendor/underscore',
    'backbone': 'scripts/vendor/backbone',
    'handlebars': 'scripts/vendor/handlebars'
  }
});
 
require(['jquery'], function($) {
    function run(tab){
        if(typeof tab !== 'undefined'){
            
            console.log("running with", tab);    

            var context = {
                tab : tab,
                inspectedUrl : null
            };


            //keep an eye on the current tab to monitor navigation around the site
            chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
                if(tab.id !== context.tab.id){ return; }
                
                if(changeInfo.status === 'complete'){
                    // url has changed and the content is loaded
                    if(context.inspectedUrl !== tab.url){
                        //chrome will fire updated event with status 'complete' several times 
                        //for the same url
                        context.inspectedUrl = tab.url;
                        console.log("current tab updated",tab);
                    }   
                }
            });

            
        }
    }

    // content script pings background asking it to start the app
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
        sendResponse({});
        chrome.tabs.getSelected(null,function(t){
            run(t);
        });
    });
});