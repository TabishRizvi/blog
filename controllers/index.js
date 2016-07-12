/**
 * Created by Tabish Rizvi
 */

"use strict";
var async = require("async"),
    lib = require("../lib"),
    db = require("../db");

module.exports.CreatePostCtrl = function (req, res, next) {
    var paragraphsArray = req.payload.text.split("\n\n");
    var postUUUID = lib.utils.getUUID();

    async.waterfall([
        function(cb) {
            var sql = "INSERT INTO posts(uuid,title) VALUES(?,?)";
            var params = [postUUUID,req.payload.title];
            db.query(sql, params, function(err,result) {
                if(err) {
                    console.log("error");
                    cb(500);
                }
                else {
                    cb(null,result.insertId);
                }
            });
        },
        function(postId,cb) {
            async.each(paragraphsArray, function(element,callback) {
                var paraUUID = lib.utils.getUUID();
                var sql = "INSERT INTO paragraphs(uuid,text,post_id) VALUES(?,?,?)";
                var params = [paraUUID,element,postId];
                db.query(sql, params, function(err,result) {
                    if(err) {
                        console.log("error");
                        callback(500);
                    }
                    else {
                        callback(null);
                    }
                });
            }, cb);
        }
    ], function(err) {
        if(err) {
            lib.utils.sendResponse(res,err);
        }
        else {
            var data = {
                post_id : postUUUID
            };
            lib.utils.sendResponse(res,201,data);
        }
    });
};

module.exports.CreatePostCommentCtrl = function (req, res, next) {
    var commentUUUID = lib.utils.getUUID();

    async.waterfall([
        function(cb) {
            var sql = "INSERT INTO comments(uuid,comment) VALUES(?,?)";
            var params = [commentUUUID,req.payload.comment];
            db.query(sql, params, function(err,result) {
                if(err) {
                    console.log("error",err);
                    cb(500);
                }
                else {
                    cb(null,result.insertId);
                }
            });
        },
        function(commentId,cb) {
            var sql = "INSERT INTO post_comment_rel(post_id,comment_id) VALUES(?,?)";
            var params = [req.payload.post_id,commentId];
            db.query(sql, params, function(err) {
                if(err) {
                    console.log("error",err);
                    cb(500);
                }
                else {
                    cb(null);
                }
            });
        }
    ], function(err) {
        if(err) {
            lib.utils.sendResponse(res,err);
        }
        else {
            var data = {
                comment_id : commentUUUID
            };
            lib.utils.sendResponse(res,201,data);
        }
    });
};