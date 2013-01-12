/*
    SoundCloud search
        -- currently filters search results to only include tracks 
*/

define(["underscore", "models/soundcloud.base","jquery"], function(_,SouncloudModels,$){

    var ArtistSearchCollection = SouncloudModels.Collection.extend({
        parse: function(response) {
            return _.filter(response.collection, function(r){ return r.kind === "user"; });
        }
    });


    return {
        

        findArtist : function(name){
            var c = new ArtistSearchCollection(), dfd = $.Deferred();
            c.url = "/search?q=" + encodeURIComponent(name);
            $.when(c.fetch()).done(function(r){
                if(r.models.length !== 0){
                    dfd.resolve(r.models[0].toJSON());
                }else{
                    dfd.resolve(null);
                }
            });
            return dfd.promise();
        }

    };
});