/*
    SoundCloud search
        -- currently filters search results to only include tracks 
*/

define(["underscore", "models/soundcloud.base"], function(_,SouncloudModels){

    var ArtistSearchCollection = SouncloudModels.Collection.extend({
        parse: function(response) {
            return _.filter(response.collection, function(r){ return r.kind === "user"; });
        }
    });


    return {
        // search : function(query){
        //     if(typeof query !== 'undefined'){
        //         var c = this.newSearchCollection("/search?q=" + encodeURIComponent(query));
        //         return c.fetch();
        //     }
        // },

        findArtist : function(name){
            var c = new ArtistSearchCollection();
            c.url = "/search?q=" + encodeURIComponent(name);
            return c.fetch();
        }

        // newSearchCollection : function(url){
        //     var c = new SoundCloudSearchCollection();
        //     c.url = url;
        //     return c;
        // }
    };
});