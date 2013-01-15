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

    function askForDecoration(el){

        el.setAttribute('data-soundcloud-linkify',true);

        chrome.extension.sendMessage({what: "decorate", data : el.innerHTML}, function(response) {
          el.innerHTML = response;
          Loader.hide(el);
        });
    }

    var UrlTracker = {

        start : function(){
            var that = this;
            setInterval(function(){
                if(window.location.href !== that.url){
                    console.log("url changed",window.location.href);
                    that.url = window.location.href;
                    if(typeof that.onChange !== 'undefined'){
                        that.onChange();
                    }
                }
            },100);
        },

        onChange : function(){
        }

    };

    (function(maxDOMTries, checkFrequency){
        var DOMCheckInterval;

        UrlTracker.onChange = function(){
            
            if(typeof DOMCheckInterval !== 'undefined'){
                clearInterval(DOMCheckInterval);
            }

            var numberOfTries = 0; 

            DOMCheckInterval = setInterval(function(){
                numberOfTries++;

                console.log("Trying DOM : ", numberOfTries);

                if(numberOfTries >= maxDOMTries){ clearInterval(DOMCheckInterval); }

                var content = findContent();        
                
                if(content.length !== 0){
                    for(var i=0; i<content.length; i++){
                        if(!content[i].getAttribute('data-soundcloud-linkify')){
                            Loader.show(content[i]);
                            askForDecoration(content[i]);
                            clearInterval(DOMCheckInterval);
                        }
                    }
                }
            },checkFrequency); 
        };

        UrlTracker.start();
    })(10,500);

})();