define(["parser","underscore"], function(Parser,_){
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

                    var results = Parser.parse(c);

                    console.log("content",c);
                    console.log("expected",expected);
                    console.log("results", results);

                    // make sure we have at least as many results as expected
                    // false positives are OK for now 
                    expect(results.length >= expected.length).to.be.true;

                    for(var i=0; i<expected.length; i++){
                        console.log("checking : " + expected[i]);
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

            it("can parse tons of paragraphs", function(done){
                testSample("tons.of.paragraphs.html", "tons.of.paragraphs.artists", done);
            });

            it("can parse solid-steel-radio-show-4-1-1", function(done){
                testSample("solid-steel-radio-show-4-1-1.html", "solid-steel-radio-show-4-1-1.artists", done);
            });

            it("can parse solid-steel-radio-show-21-12", function(done){
                testSample("solid-steel-radio-show-21-12.html", "solid-steel-radio-show-21-12.artists", done);
            });

            it("can parse life-in-color-mix", function(done){
                testSample("life-in-color-mix.html", "life-in-color-mix.artists", done);
            });

            it("can parse krewella-troll-mix-volume-1", function(done){
                testSample("krewella-troll-mix-volume-1.html", "krewella-troll-mix-volume-1.artists", done);
            });

            it("can parse contract-killers-special", function(done){
                testSample("contract-killers-special.html", "contract-killers-special.artists", done);
            });

            it("can parse madeon-minimix-annie-mac-radio", function(done){
                testSample("madeon-minimix-annie-mac-radio.html", "madeon-minimix-annie-mac-radio.artists", done);
            });

            it("can parse david-guetta-dj-mix-119", function(done){
                testSample("david-guetta-dj-mix-119.html", "david-guetta-dj-mix-119.artists", done);
            });

        });

   });
});