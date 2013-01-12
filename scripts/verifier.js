define(['jquery','underscore','models/soundcloud.search'], function($,_,Search){

    function findArtist(artist) {
        return Search.findArtist(artist);
    }  

    return {

        verify : function(artists, done){
            $.when.apply(null,_.map(artists, findArtist)).done(function(){
                
                var verifiedArtists = [];

                _.each(arguments, function(artist,i){
                    if(artist){
                        verifiedArtists.push({
                            originalName : artists[i],
                            data : artist
                        });
                    }
                });

                if(typeof done !== 'undefined'){
                    done(verifiedArtists);
                }
            });
        }

    };

});