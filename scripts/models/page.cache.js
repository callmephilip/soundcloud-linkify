define([], function(){

    function __isUrl(str){
        return str.match(
            new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
        );
    }

    function __normalizeUrl(url){
        /* 
            Normalization

                http://google.com/hello/?v1=3 -> http://google.com/hello/
                http://google.com/hello/#v1=3 -> http://google.com/hello/
        */

        var m = /([^#\?])+/gi.exec(url);
        return m[0];
    }

    return {

        get : function(url){
            if(!__isUrl(url || "")){ throw new Error("No url provided"); }
            
            try{
                return localStorage.getItem(__normalizeUrl(url));    
            }catch(e){
                return null;
            }
        },

        set : function(url, content){
            if(!__isUrl(url || "") || (typeof content === 'undefined')){ 
                throw new Error("Url and content are both required"); 
            }

            try{
                localStorage.setItem(__normalizeUrl(url),content);
            }catch(e){
                return null;
            }
        }
    };

});