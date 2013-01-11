/*
    SoundCloud search
        -- currently filters search results to only include tracks 
*/

define(["underscore", "models/soundcloud.base"], function(_,SouncloudModels){

    var SoundCloudSearchCollection = SouncloudModels.Collection.extend({
        
        parse: function(response) {
            // tracks only, por favor
            return _.map(_.filter(response.collection, function(r){
                return r.kind === "track";
            }),function(t){
                return { 
                    id : t.id,
                    artwork_url : t.artwork_url,   
                    title : t.title,
                    user_avatar_url : t.user.avatar_url,
                    user_username : t.user.username
                };
            });
        }
    });


    return {
        search : function(query){
            if(typeof query !== 'undefined'){
                var c = this.newSearchCollection("/search?q=" + encodeURIComponent(query));
                return c.fetch();
            }
        },

        newSearchCollection : function(url){
            var c = new SoundCloudSearchCollection();
            c.url = url;
            return c;
        }
    };
});