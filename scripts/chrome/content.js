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

    //convert plain text containing artist's name into something less plain
    function formatArtist(name){
        return '<span style="color:red;">'+ name +'</span>';
    }

    //background is calling
    chrome.extension.onMessage.addListener(function(msg, _, sendResponse) {
        console.log("Got message from background page: ", msg);
    

        if(msg.what === 'inspect'){
            setTimeout(function(){
                var content = findContent(), textContent = [];

                for(var i=0; i<content.length; i++){
                    textContent.push(content[i].innerHTML);
                }

                sendResponse(textContent);
                console.log(content);
            }, 5000);

            return true;
        }

        if(msg.what === "artists"){

            function htmlEscape(str) {
                return String(str)
                        .replace(/&/g, '&amp;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
            }

            console.log("got artists from the background", msg.data);

            var sections = findContent(), artists = msg.data;

            for(var i=0; i<sections.length; i++){
                var html = sections[i].innerHTML;
                for(var j=0; j<artists.length; j++){
                    html = html.replace(htmlEscape(artists[j]), formatArtist(artists[j]));
                }

                sections[i].innerHTML = html;
            } 
        }

    });

    // get the background script going
    chrome.extension.sendRequest({}, function(response) {});
})();