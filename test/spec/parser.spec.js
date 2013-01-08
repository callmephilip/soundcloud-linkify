define(["parser"], function(Parser){
   describe("Parser", function(){

        describe("module", function(){
            it("can be imported", function(){
                expect(Parser).to.be.ok;
            });

            it("exports parse method", function(){
                expect(Parser).to.respondTo('parse');
            });
        });

        describe("parse", function(){

            function testSample(file, expected, done){
                var base = "text!../samples/";

                require([base + file, base + expected], function(c,e){
                    
                    expected = e.split("\n");

                    console.log("content",c);
                    console.log("expected",expected);

                    var results = Parser.parse(c);

                    console.log("results", results);

                    expect(results.length).to.equal(expected.length);

                    for(var i=0; i<expected.length; i++){
                        expect(results.indexOf(expected[i])).to.not.equal(-1);
                    }

                    done();
                });
            }


            it("requires content", function(){
                var fn = function(){ Parser.parse(); };
                expect(fn).to.throw("Nothing to parse");
            });

            it("can parse number- artist -title -label", function(done){
                testSample("number-artist-title-label.html", "number-artist-title-label.artists", done);
            });

        });

   });
});