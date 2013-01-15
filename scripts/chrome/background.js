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
 
require(['jquery','underscore','parser','decorator','verifier', 'soundcloud', 'models/page.cache'], 

    function($,_,Parser,Decorator,Verifier,SC,PageCache) {

        function testing(){
            return $("#mocha").length !== 0;
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

            //content script is talking back
            chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
                
                function notify(content, needsVisual){
                    sendResponse(content);
                    if(needsVisual){
                        chrome.pageAction.show(sender.tab.id);
                    }
                }

                // content script sends over html to decorate
                if(request.what === "decorate"){
                    console.log("BG: got decoration request",request);
                    
                    //check if current page is in the cache
                    if(PageCache.get(sender.tab.url)){
                        notify(PageCache.get(sender.tab.url), true);
                        return;
                    }


                    var artists = Parser.parse(request.data);

                    console.log("got content", request.data);
                    console.log("artists identified", artists);

                    //check every single identified artist against SC to get additional data

                    Verifier.verify(artists, function(verifiedArtists){
                        console.log("got verified artists", verifiedArtists);

                        var decoration = Decorator.decorate(request.data, verifiedArtists); 

                        if(verifiedArtists.length !== 0){
                            PageCache.set(sender.tab.url, decoration);
                        }

                        notify(decoration, verifiedArtists.length !== 0);
                    });

                    return true;
                }
            });
    }
});