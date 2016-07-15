/**
 * Created by Tabish Rizvi
 */

"use strict";
var chai = require("chai"),
    mocha = require("mocha"),
    supertest = require("supertest"),
    async = require("async"),
    testData = require("./test_data.json");
    
var expect = chai.expect;
/*var describe = mocha.describe;
var before = mocha.before;
var it = mocha.it;*/
var server = supertest.agent("http://localhost:7777/api/v1");

describe("post list", function() {
    var testDataIds = [];
    this.timeout(150000);

    before("Filling dummy data",function(done) {

        async.eachSeries(testData.posts,function(element,callback) {
            var body = element;
            server
                .post("/post")
                .send(body)
                .expect("Content-type",/json/)
                .expect(201)
                .end(function(err,res){
                    testDataIds.push(res.body.data.post_id);
                    setTimeout(function(){
                        callback(null);
                    },1000);
                });
        }, done);
    });

    after("Erasing dummy data",function(done) {
        async.each(testDataIds,function(element,callback) {
            var post_id = element;
            server
                .delete("/post/"+post_id)
                .send()
                .expect("Content-type",/json/)
                .expect(200)
                .end(function(err,res){
                    callback(null);
                });
        }, done);
    });

    it("test1", function(done) {
        server
            .get("/post")
            .send()
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res){
                var i;
                expect(res.body.data.next_ptr).to.equal(5);
                expect(res.body.data.prev_ptr).to.equal(null);

                for(i=0;i<res.body.data.list.length;i++) {
                    expect(res.body.data.list[i].title).to.equal(testData.posts[i].title);
                }
                done();
            });
    });

    it("test2", function(done) {
        server
            .get("/post")
            .query({ptr : 95})
            .send()
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res){
                console.log(res.body);
                expect(res.body.data.next_ptr).to.equal(null);
                expect(res.body.data.prev_ptr).to.equal(90);
                done();
            });
    });
});
