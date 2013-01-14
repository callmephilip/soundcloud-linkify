define([], function(){

    function __isUrl(str){
        return str.match(
            new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
        );
    }

    return {

        get : function(url){
            if(!__isUrl(url || "")){ throw new Error("No url provided"); }
            
            try{
                return localStorage.getItem(url);    
            }catch(e){
                return null;
            }
            
        },

        set : function(url, content){
            if(!__isUrl(url || "") || (typeof content === 'undefined')){ 
                throw new Error("Url and content are both required"); 
            }

            try{
                localStorage.setItem(url,content);
            }catch(e){
                return null;
            }
        }
    };

});