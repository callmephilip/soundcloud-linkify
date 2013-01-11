define(["models/soundcloud.search","soundcloud","underscore","jquery"], function(Search,SC,_,$){
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

            afterEach(function(){
                if(typeof SC.get.restore !== 'undefined'){
                    SC.get.restore();
                }
            });

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

            it("returns one artist if she's on soundcloud", function(done){
                
                var searchTerm = "nero";

                sinon.stub(SC, 'get', function(url,callback){
                    searchResults(searchTerm, function(r){
                        callback(r); 
                    });
                });

                $.when(Search.findArtist(searchTerm)).done(function(artist){
                    expect(artist).to.be.ok;
                    expect(artist.length).to.not.be.ok;
                    expect(artist.kind).to.equal('user');
                    done();
                });

            });
        });

    });
});