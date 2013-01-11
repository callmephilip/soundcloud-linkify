/*
    SoundCloudCollection is a base class class for SC API based Backbone Collections 
        - currently is only read only
        - child classes provide resource urls, data is then accessible through a standard fetch   

    TODO: add support for inserts,updates and deletes
*/

define(["underscore","backbone","soundcloud"],function(_,Backbone,SC){

    var SoundCloudCollection = Backbone.Collection.extend({
        sync : function(method, model, options){ 
            if(method === "read"){
                var dfd = new $.Deferred();

                SC.get(this.url, _.bind(function(r){
                    if(typeof options.success !== 'undefined'){
                        options.success(r);
                    }  
                    dfd.resolve(this);    
                },this));

                return dfd.promise();
            } else {
                throw new Error("Operation not supported");
            }
        }
    });

    return {
        Collection : SoundCloudCollection
    };

});