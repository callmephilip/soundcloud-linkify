define([],function(){
    
    function match(str,exp){
        return exp.exec(str);
    }

    function prettify(name){
        var prettifiers = [
            
            function(s){ /* trim */
                return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
            },

            function(s){ /* unescape html */ 
                return $("<div>" + s + "</div>").text();
            }
        ];

        for(var i=0; i<prettifiers.length; i++){
            name = prettifiers[i](name);
        }

        return name;
    }

    var matchers = [
        function(content){
            var m = match(content,/^[0-9]+-\s*([^-]+)-/gi);
            if(m){
                return m[1];
            }
        }
    ];



    return {
        parse : function(content){
            if(typeof content === 'undefined'){
                throw new Error("Nothing to parse");
            }

            // grab text
            // and split on brs

            var results = [], 
                tc = $(content).html(),
                lines = tc.split("<br>");

            //  try different matchers

            for(var i=0; i<lines.length; i++){
                for(var j=0; j<matchers.length; j++){
                    var m = matchers[j](lines[i]);
                    if(typeof m !== 'undefined'){
                        results.push(prettify(m));
                        break;
                    }
                }  
            } 

            return results;            
        }
    };
});