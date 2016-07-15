/**
 * Created by Tabish Rizvi
 */

"use strict";
var async = require("async"),
    _ = require("underscore"),
    lib = require("../lib"),
    db = require("../db");

module.exports.CreatePostCtrl = function (req, res) {
    var paragraphsArray = req.payload.text.split("\n\n");
    var postUUID = lib.utils.getUUID();

    async.waterfall([
        function(cb) {
            var sql = "INSERT INTO posts(uuid,title) VALUES(?,?)";
            var params = [postUUID,req.payload.title];
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
        function(postId,cb) {
            async.each(paragraphsArray, function(element,callback) {
                var paraUUID = lib.utils.getUUID();
                var sql = "INSERT INTO paragraphs(uuid,text,post_id) VALUES(?,?,?)";
                var params = [paraUUID,element,postId];
                db.query(sql, params, function(err) {
                    if(err) {
                        console.log("error",err);
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
                post_id : postUUID
            };
            lib.utils.sendResponse(res,201,data);
        }
    });
};

module.exports.CreatePostCommentCtrl = function (req, res) {
    var commentUUID = lib.utils.getUUID();
    var postId;

    async.waterfall([
        function(cb) {
            lib.main.getIdFromUUID(req.payload.post_id, "posts" ,function(err, result) {
                if(err){
                    cb(err);
                }
                else{
                    postId = result;
                    cb(null);
                }
            });
        },
        function(cb) {
            var sql = "INSERT INTO comments(uuid,comment,para_id,post_id) VALUES(?,?,?,?)";
            var params = [commentUUID,req.payload.comment,null,postId];
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
                comment_id : commentUUID
            };
            lib.utils.sendResponse(res,201,data);
        }
    });
};

module.exports.CreateParagraphCommentCtrl = function (req, res) {
    var commentUUID = lib.utils.getUUID();
    var paraId;

    async.waterfall([
        function(cb) {
            lib.main.getIdFromUUID(req.payload.para_id, "paragraphs" ,function(err, result) {
                if(err){
                    cb(err);
                }
                else{
                    paraId = result;
                    cb(null);
                }
            });
        },
        function(cb) {
            var sql = "INSERT INTO comments(uuid,comment,para_id,post_id) VALUES(?,?,?,?)";
            var params = [commentUUID,req.payload.comment,paraId,null];
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
                comment_id : commentUUID
            };
            lib.utils.sendResponse(res,201,data);
        }
    });
};

module.exports.FetchPostCtrl = function (req, res) {
    async.waterfall([
        function(cb) {
            var sql = "SELECT a.uuid as post_id,a.title,a.date_created,b.uuid as para_id,b.text FROM posts a INNER JOIN paragraphs b ON a.post_id = b.post_id WHERE  a.uuid=?";
            var params = [req.payload.post_id];
            db.query(sql, params, function(err,result) {
                if(err) {
                    console.log("error",err);
                    cb(500);
                }
                else if(result.length===0) {
                    cb(404);
                }
                else {
                    var data = {};
                    data.post_id = result[0].post_id;
                    data.title = result[0].title;
                    data.date_created = result[0].date_created;
                    data.text = _.map(result,function(element) {
                        return element.text;
                    }).join("\n\n");
                    data.paragraphs = _.map(result,function(element) {
                        return _.pick(element,["para_id","text"]);
                    });
                    cb(null,data);
                }
            });
        }
    ], function(err,result) {
        if(err) {
            lib.utils.sendResponse(res,err);
        }
        else {
            lib.utils.sendResponse(res,200,result);
        }
    });
};

module.exports.FetchPostsListCtrl = function (req, res) {
    var list,count;
    async.waterfall([
        function(cb) {
            var sql = "SELECT uuid as post_id,title,date_created FROM posts ORDER BY "+lib.main.getOrderKey("posts",req.payload.order_by)+" "+(req.payload.asc?"ASC":"DESC")+" LIMIT 5 OFFSET ?";
            var params = [req.payload.ptr];
            db.query(sql, params, function(err,result) {
                if(err) {
                    console.log("error",err);
                    cb(500);
                }
                else {
                    list = result;
                    cb(null);
                }
            });
        },
        function(cb) {
            var sql = "SELECT COUNT(post_id) as count FROM posts";
            db.query(sql,[], function(err,result) {
                if(err) {
                    console.log("error",err);
                    cb(500);
                }
                else {
                    count = result[0].count;
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
                list : list,
                next_ptr : req.payload.ptr + 5 >= count ? null : req.payload.ptr + 5,
                prev_ptr : req.payload.ptr - 5 <= 0 ? null : req.payload.ptr - 5
            };
            lib.utils.sendResponse(res,200,data);
        }
    });
};

module.exports.FetchPostCommentsCtrl = function (req, res) {
    async.waterfall([
        function(cb) {
            lib.main.getIdFromUUID(req.payload.post_id, "posts" ,function(err) {
                if(err){
                    cb(err);
                }
                else{
                    cb(null);
                }
            });
        },
        function(cb) {
            var sql = "SELECT b.uuid as comment_id,b.comment,b.date_created FROM posts a INNER JOIN comments b ON a.post_id = b.post_id WHERE  a.uuid=?";
            var params = [req.payload.post_id];
            db.query(sql, params, function(err,result) {
                if(err) {
                    console.log("error",err);
                    cb(500);
                }
                else {
                    cb(null,result);
                }
            });
        }
    ], function(err,result) {
        if(err) {
            lib.utils.sendResponse(res,err);
        }
        else {
            lib.utils.sendResponse(res,200,result);
        }
    });
};

module.exports.FetchParagraphCommentsCtrl = function (req, res) {
    async.waterfall([
        function(cb) {
            lib.main.getIdFromUUID(req.payload.para_id, "paragraphs" ,function(err) {
                if(err){
                    cb(err);
                }
                else{
                    cb(null);
                }
            });
        },
        function(cb) {
            var sql = "SELECT b.uuid as comment_id,b.comment,b.date_created FROM paragraphs a INNER JOIN comments b ON a.para_id = b.para_id WHERE  a.uuid=?";
            var params = [req.payload.para_id];
            db.query(sql, params, function(err,result) {
                if(err) {
                    console.log("error",err);
                    cb(500);
                }
                else {
                    cb(null,result);
                }
            });
        }
    ], function(err,result) {
        if(err) {
            lib.utils.sendResponse(res,err);
        }
        else {
            lib.utils.sendResponse(res,200,result);
        }
    });
};

module.exports.DeletePostCtrl = function (req, res) {
    async.waterfall([
        function(cb) {
            var sql = "DELETE FROM posts WHERE uuid=?";
            var params = [req.payload.post_id];
            db.query(sql, params, function(err,result) {
                if(err) {
                    console.log("error",err);
                    cb(500);
                }
                else if(result.affectedRows===0) {
                    cb(404);
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
            lib.utils.sendResponse(res,200);
        }
    });
};

module.exports.DeleteCommentCtrl = function (req, res) {
    async.waterfall([
        function(cb) {
            var sql = "DELETE FROM comments WHERE uuid=?";
            var params = [req.payload.comment_id];
            db.query(sql, params, function(err,result) {
                if(err) {
                    console.log("error",err);
                    cb(500);
                }
                else if(result.affectedRows===0) {
                    cb(404);
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
            lib.utils.sendResponse(res,200);
        }
    });
};