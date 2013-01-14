(function(){

    //this is where artist names are hiding 
    var targetSelectors = [
        '.listenDetails__description'
    ];
    
    //poor man's jquery
    function $(classSelector){
        var parts = classSelector.split('.');
        return document.getElementsByClassName(
            parts.length === 2 ? parts[1] : parts[0]
        );
    }

    //locate content on the page that could contain artist names  
    function findContent(){
        var results = [], batch = [];

        for(var i=0; i<targetSelectors.length; i++){
            batch = $(targetSelectors[i]);
            for(var j=0; j<batch.length; j++){
                results.push(batch[j]);
            } 
        }

        return results;
    }

    var Loader = {

        show : function(el){
            el.classList.add("soundcloud-linkify-working");
        },

        hide : function(el){
            el.classList.remove("soundcloud-linkify-working");
        }

    };

    //background is calling
    chrome.extension.onMessage.addListener(function(msg, _, sendResponse) {
        console.log("Got message from background page: ", msg);
    
        function askForDecoration(el){
            chrome.extension.sendMessage({what: "decorate", data : el.innerHTML}, function(response) {
              el.innerHTML = response;
              Loader.hide(el);
            });
        }


        if(msg.what === 'inspect'){
            setTimeout(function(){                
                //for every single chunk of content, send a 'decorate' request
                var content = findContent();

                for(var i=0; i<content.length; i++){
                    Loader.show(content[i]);
                    askForDecoration(content[i]);
                }

            }, 5000);

            return true;
        }

    });

    // get the background script going
    chrome.extension.sendRequest({}, function(response) {});
})();