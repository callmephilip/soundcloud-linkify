define(["models/page.cache","underscore"], function(PageCache,_){

    describe("Page Cache", function(){
        
        describe("module", function(){
            it("can be imported", function(){
                expect(PageCache).to.be.ok;
            });

            it("exports get", function(){
                expect(PageCache).to.respondTo("get");
            });

            it("exports set", function(){
                expect(PageCache).to.respondTo("set"); 
            });
        });

        var pageUrl = "https://soundcloud.com/laurent-garnier/s4e17";

        describe("get", function(){

            afterEach(function(){
                if(typeof localStorage.getItem.restore !== 'undefined'){
                    localStorage.getItem.restore();
                }

                localStorage.clear();
            });

            it("requires a url", function(){
                var fn1 = function(){
                    PageCache.get();
                }, fn2 = function(){
                    PageCache.get("this is not a url");
                };

                expect(fn1).to.throw("No url provided");
                expect(fn2).to.throw("No url provided");
            });

            it("hits localStorage.getItem with a given url as a key", function(done){

                sinon.stub(localStorage,'getItem', function(url){
                    expect(url).to.equal(pageUrl);
                    done();
                });

                PageCache.get(pageUrl);
            });

            it("gracefully handles localStorage exception", function(){
                sinon.stub(localStorage,'getItem',function(){
                    throw new Error("Local storage is not happy");
                });

                expect(PageCache.get(pageUrl)).to.not.be.ok;
            });

            it("returns null if a given page is not cached", function(){
                expect(PageCache.get(pageUrl)).to.not.be.ok;
            });

            it("returns something if a given page is cached", function(){
                localStorage.setItem(pageUrl,"this-is-page-content");
                expect(PageCache.get(pageUrl)).to.be.ok;
            });

            it("normalizes url before using it", function(done){

                var urls = [
                    pageUrl + "#cutthisout",
                    pageUrl + "?cutthisout"
                ];

                sinon.stub(localStorage, "getItem", function(url){
                    expect(url).to.equal(pageUrl);
                    if(urls.length === 0){
                        done();
                    }
                });

                while(urls.length !== 0){
                    PageCache.get(urls.pop());
                }

            });
        });


        describe("set", function(){

            var pageContent = "this is page content";

            afterEach(function(){
                if(typeof localStorage.getItem.restore !== 'undefined'){
                    localStorage.getItem.restore();
                }

                if(typeof localStorage.setItem.restore !== 'undefined'){
                    localStorage.setItem.restore();
                }

                localStorage.clear();
            });

            it("requires a url and content as parameters", function(){
                var fns = [
                    function(){ PageCache.set(); },
                    function(){ PageCache.set("this is not a url"); },
                    function(){ PageCache.set("google.com"); },
                    function(){ PageCache.set(null,"content"); },
                ]; 

                _.each(fns, function(f){
                    expect(f).to.throw("Url and content are both required");
                });
            });

            it("hits localStorage.setItem with given url and content", function(done){
                sinon.stub(localStorage,"setItem",function(url,content){
                    expect(url).to.equal(pageUrl);
                    expect(content).to.equal(pageContent);
                    done();
                });

                PageCache.set(pageUrl,pageContent);
            });

            it("gracefully handles localStorage exception", function(){
                sinon.stub(localStorage,'setItem',function(){
                    throw new Error("Local storage is not happy");
                });

                expect(PageCache.set(pageUrl,pageContent)).to.not.be.ok;
            });

            it("normalizes url before using it", function(done){

                var urls = [
                    pageUrl + "#cutthisout",
                    pageUrl + "?cutthisout"
                ];

                sinon.stub(localStorage, "setItem", function(url){
                    expect(url).to.equal(pageUrl);
                    if(urls.length === 0){
                        done();
                    }
                });

                while(urls.length !== 0){
                    PageCache.set(urls.pop(),pageContent);
                }

            });

        });

    });

});