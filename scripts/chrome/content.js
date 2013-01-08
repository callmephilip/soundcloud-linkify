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
                results.push(batch[j].innerHTML);
            } 
        }

        return results;
    }


    //background is calling
    chrome.extension.onMessage.addListener(function(msg, _, sendResponse) {
        console.log("Got message from background page: ", msg);
    
        if(msg.what === 'inspect'){
            setTimeout(function(){
                sendResponse(findContent());
                console.log(findContent());
            }, 5000);
        }

        return true;
    });

    //chrome.extension.sendMessage({setAlarm: true});


    // get the background script going
    chrome.extension.sendRequest({}, function(response) {});
})();