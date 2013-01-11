define(["jquery", "underscore"],function($,_){

    //convert plain text containing artist's name into something less plain
    function formatArtist(artist){
        return '<span style="color:red;">' + artist + '</span>';
    }

    function htmlEscape(str) {
        return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }

    function doNotBreakHtmlRegExp(str){
        /*
            Avoid the following
                - inject things in the middle of a url
        */
        return new RegExp("(?=[^/']+)" + htmlEscape(str), // + "(?=[^/']+)", 
            "gi");

        //eplace(/(?=[^/']+)(bob)(?=[^/']+)/gi,"New Bob")
    }

    return {
        decorate : function(content, artists){
            for(var j=0; j<artists.length; j++){
                content = content.replace(doNotBreakHtmlRegExp(artists[j]),formatArtist(artists[j]));
            }
            
            return content;
        } 
    };
});