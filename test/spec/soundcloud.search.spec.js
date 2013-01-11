define(["models/soundcloud.search"], function(Search){
    describe("Soundcloud Search",function(){
        
        describe("module", function(){

            it("can be imported", function(){
                expect(Search).to.be.ok;
            });

            it("exports findArtist", function(){
                expect(Search).to.respondTo('findArtist');
            });

        });

    });
});