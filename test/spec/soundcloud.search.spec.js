define(["models/soundcloud.search","soundcloud"], function(Search,SC){
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

            it("hits SC's search with a query", function(done){
                
                var searchTerm = 'High Contrast';

                sinon.stub(SC,'get',function(url){
                    expect(url).to.equal('/search?q=' + encodeURIComponent(searchTerm));
                    done();
                });

                Search.findArtist(searchTerm);
            });

            it("returns one artist if she's on soundcloud", function(){
                //TODO
            });

            it("returns nothing if the artist is NOT on soundcloud", function(){
                //TODO
            });

        });

    });
});