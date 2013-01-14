define(["jquery", "underscore", "xregexp"],
    function($,_,XRegExp){

    //convert plain text containing artist's name into something less plain
    function formatArtist(artist){
        return jQuery("<div>").append(
            jQuery("<span>")
                .append(
                    jQuery("<a>").html(artist.originalName).attr("href",artist.data.permalink_url)
                )
                .css('color','red')
        ).html();
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
            "(?i)(?<!['\"/])", new RegExp(artist.originalName+"(?!['\"/])","gi"), formatArtist(artist)
        );
    }

    return {
        decorate : function(content, artists){

            for(var j=0; j<artists.length; j++){
                content = doNotBreakHtmlRegExp(content,artists[j]);
            }

            return content;
        } 
    };
});