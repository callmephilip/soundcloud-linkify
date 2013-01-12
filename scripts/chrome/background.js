require.config({
  baseUrl : "scripts",
  shim: {
    'underscore' : { exports : '_' },
    'backbone' : { deps : ['underscore'], exports : 'Backbone' },
    'handlebars' : { exports : 'Handlebars' },
    'soundcloud' : { exports: 'SC' },
    'xregexp' : { exports : 'XRegExp'}
  },

  paths: {
    'jquery': 'vendor/jquery.min',
    'underscore': 'vendor/underscore',
    'backbone': 'vendor/backbone',
    'handlebars': 'vendor/handlebars',
    'text': 'vendor/text',
    'soundcloud': 'vendor/soundcloud', 
    'xregexp': 'vendor/xregexp',
    'models' : 'models'
  }
});
 
require(['jquery','parser','decorator','verifier', 'soundcloud'], function($,Parser,Decorator,Verifier,SC) {

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

        function getSoundCloudSettings(){
            return { //production settings
                client_id: "75183d3e642d5c008a5fa0d33a6e7da5",
                redirect_uri: "http://callmephilip.github.com/stacks/soundcloud.callback.html"
            }
        }

        // get the soundcloud goodness ready go
        SC.initialize(getSoundCloudSettings());

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

                //check every single identified artist against SC to get additional data

                Verifier.verify(artists, function(verifiedArtists){
                    console.log("got verified artists", verifiedArtists);

                    //update page content and send it back
                    sendResponse(Decorator.decorate(request.data, verifiedArtists));
                });

                return true;
            }
        });
    }
});