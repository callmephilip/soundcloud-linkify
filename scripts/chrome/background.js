require.config({
  baseUrl : "scripts",
  shim: {
    'underscore' : { exports : '_' },
    'backbone' : { deps : ['underscore'], exports : 'Backbone' },
    'handlebars' : { exports : 'Handlebars' },
    'soundcloud' : { exports: 'SC' }
  },

  paths: {
    'jquery': 'vendor/jquery.min',
    'underscore': 'vendor/underscore',
    'backbone': 'vendor/backbone',
    'handlebars': 'vendor/handlebars',
    'text': 'vendor/text',
    'soundcloud': 'vendor/soundcloud', 
    'models' : 'models'
  }
});
 
require(['jquery','parser', 'decorator'], function($,Parser,Decorator) {

    function testing(){
        return $("#mocha").length !== 0;
    }

    //schedule tab inspection
    function inspect(tab){
        chrome.tabs.sendMessage(tab.id, { what : "inspect" });
    }


    function run(tab){
        if(typeof tab !== 'undefined'){
            
            console.log("running with", tab);    

            var context = {
                tab : tab,
                inspectedUrl : null
            };


            var urls = [
                tab.url
            ];

            //keep an eye on the current tab to monitor navigation around the site
            chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
                if(tab.id !== context.tab.id){ return; }
             
                if(typeof changeInfo.url !== 'undefined'){
                    if(urls.indexOf(changeInfo.url) === -1){
                        urls.push(changeInfo.url);
                    }
                }

                if((changeInfo.status === 'complete') && (typeof tab.favIconUrl !== 'undefined')){
                    // url has changed and the content is loaded
                    if(urls.indexOf(tab.url) !== -1){
                        urls.splice(urls.indexOf(tab.url),1);
                        console.log("current tab updated",tab);
                        inspect(tab);                        
                    }
                }
            });
        }
    }

    if(!testing()){

        // content script pings background asking it to start the app
        chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
            sendResponse({});
            chrome.tabs.getSelected(null,function(t){
                run(t);
            });
        });

        //content script is talking back
        chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
                
            // content script sends over html to decorate
            if(request.what === "decorate"){
                console.log("BG: got decoration request",request);
                
                var artists = Parser.parse(request.data);

                console.log("got content", request.data);
                console.log("artists identified", artists);
            
                //update page content and send it back
                sendResponse(Decorator.decorate(request.data, artists));
            }
        });
    }
});