define(["jquery", "underscore", "xregexp"],function($,_,XRegExp){

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

    function doNotBreakHtmlRegExp(str,artist){
        /*
            Avoid the following
                - inject things in the middle of a url
        */
        
        return XRegExp.replaceLb(str, 
            "(?i)(?<!['\"/])", new RegExp(artist+"(?!['\"/])","gi"), formatArtist(artist)
        );
    }

    return {
        decorate : function(content, artists){

            console.log(XRegExp);

            for(var j=0; j<artists.length; j++){
                content = doNotBreakHtmlRegExp(content,artists[j]);
            }

            return content;
        } 
    };
});