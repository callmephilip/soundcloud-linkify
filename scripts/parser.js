define(["jquery", "underscore"],function($,_){
    
    function getParagraphs(content){
        var wrapper = jQuery("<div></div>").html(content);
        return _.map($(wrapper).children("p"), function(p){
            return $(p).html();
        });
    }

    function getLines(content){

        function cleanLine(l){
            //no links
            return l.replace(/<a\b[^>]*>(.*?)<\/a>/i,"");
        }

        var paragraphs = getParagraphs(content), lines = [];

        for(var i=0; i<paragraphs.length; i++){
            var ls = paragraphs[i].split('<br>');
            for(var j=0; j<ls.length; j++){
                lines.push(cleanLine(ls[j]));
            }
        }

        return lines;
    }

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
        //01- THATMANMONKZ -that would be alright -TONE CONTROL
        function(content){
            var m = match(content,/^[0-9\)]+-\s*([^-]+)-/gi);
            if(m){ return m[1]; }
        },
        //Sol Heilo_Hold On_Youtube
        function(content){
            var m = match(content,/^([^\_]+)\_/gi);
            if(m){ return m[1]; }
        },
        //[10.] The Beatles - The End - Apple Records
        function(content){
            var m = match(content,/^[0-9\)]*\.*\s*([^-]+)-\s*[^-]+-\s*.+$/gi);
            if(m){ return m[1]; }
        },
        //[10.] Funk Factory - Rien Ne Va Plus (ATCO Records)
        function(content){
            var m = match(content,/^[0-9\)]*\.*\s*(.{1,50}?)-\s*[^-]+$/gi);
            if(m){ return m[1]; }
        },
    ];



    return {
        parse : function(content){
            if(typeof content === 'undefined'){
                throw new Error("Nothing to parse");
            }

            // grab text
            // and split on brs

            var results = [];
            var lines = getLines(content);

            console.log("LINES", lines);

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