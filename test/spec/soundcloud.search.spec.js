define(["models/soundcloud.search","soundcloud","underscore"], function(Search,SC,_){
    describe("Soundcloud Search",function(){
        
        describe("module", function(){

            it("can be imported", function(){
                expect(Search).to.be.ok;
            });

            it("exports findArtist", function(){
                expect(Search).to.respondTo('findArtist');
            });

        });

        describe("findArtist", function(){

            /*
                Load sample search results from searches directory
            */
            function searchResults(query, done){
                require(["text!../searches/"+query+".json"],function(s){                    
                    if(typeof done !== 'undefined'){
                        done(JSON.parse(s));   
                    }
                });
            }

            it("hits SC's search with a query", function(done){
                
                var searchTerm = 'High Contrast';

                sinon.stub(SC,'get',function(url){
                    expect(url).to.equal('/search?q=' + encodeURIComponent(searchTerm));
                    done();
                });

                Search.findArtist(searchTerm);
            });

            it("returns one artist if she's on soundcloud", function(){
            });

            it("returns nothing if the artist is NOT on soundcloud", function(){
                //TODO
            });

        });

    });
});