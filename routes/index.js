/**
 * Created by Tabish Rizvi
 */
"use strict";
var express = require("express"),
    Joi = require("joi"),
    lib = require("../lib"),
    controllers = require("../controllers");

var router = express.Router();

router.post("/post",function(req,res,next) {
    var schema = Joi.object().keys({
        title: Joi.string().min(6).max(250),
        text : Joi.string().min(50)
    });

    lib.utils.validate(req.body,schema,function(err){
        if(err){
            lib.utils.sendResponse(res,400,err);
        }
        else{
            req.payload = req.body;
            next();
        }
    });

},controllers.CreatePostCtrl);

router.post("/comment/post",function(req,res,next) {
    var schema = Joi.object().keys({
        post_id: Joi.string().guid(),
        comment : Joi.string().min(6)
    });

    lib.utils.validate(req.body,schema,function(err){
        if(err){
            lib.utils.sendResponse(res,400,err);
        }
        else{
            req.payload = req.body;
            next();
        }
    });

},controllers.CreatePostCommentCtrl);

router.post("/comment/paragraph",function(req,res,next) {
    var schema = Joi.object().keys({
        para_id: Joi.string().guid(),
        comment : Joi.string().min(6)
    });

    lib.utils.validate(req.body,schema,function(err){
        if(err){
            lib.utils.sendResponse(res,400,err);
        }
        else{
            req.payload = req.body;
            next();
        }
    });

},controllers.CreateParagraphCommentCtrl);

router.get("/post/:post_id",function(req,res,next) {
    var schema = Joi.object().keys({
        post_id: Joi.string().guid()
    });

    lib.utils.validate(req.params,schema,function(err){
        if(err){
            lib.utils.sendResponse(res,400,err);
        }
        else{
            req.payload = req.params;
            next();
        }
    });

},controllers.FetchPostCtrl);

router.get("/post",function(req,res,next) {
    var schema = Joi.object().keys({
        ptr: Joi.number().min(0).optional().default(0),
        order_by : Joi.any().valid(["date","title"]).optional().default("date"),
        asc : Joi.boolean().optional().default(true)
    });

    lib.utils.validate(req.query,schema,function(err, value){
        if(err){
            lib.utils.sendResponse(res,400,err);
        }
        else{
            req.payload = value;
            console.log(req.payload);
            next();
        }
    });

},controllers.FetchPostsListCtrl);

router.get("/comment/post/:post_id",function(req,res,next) {
    var schema = Joi.object().keys({
        post_id: Joi.string().guid()
    });

    lib.utils.validate(req.params,schema,function(err){
        if(err){
            lib.utils.sendResponse(res,400,err);
        }
        else{
            req.payload = req.body;
            next();
        }
    });

},controllers.FetchPostCommentsCtrl);

router.get("/comment/paragraph/:para_id",function(req,res,next) {
    var schema = Joi.object().keys({
        para_id: Joi.string().guid()
    });

    lib.utils.validate(req.params,schema,function(err){
        if(err){
            lib.utils.sendResponse(res,400,err);
        }
        else{
            req.payload = req.body;
            next();
        }
    });

},controllers.FetchParagraphCommentsCtrl);

router.delete("/post/:post_id",function(req,res,next) {
    var schema = Joi.object().keys({
        post_id: Joi.string().guid()
    });

    lib.utils.validate(req.params,schema,function(err){
        if(err){
            lib.utils.sendResponse(res,400,err);
        }
        else{
            req.payload = req.params;
            next();
        }
    });

},controllers.DeletePostCtrl);

router.delete("/comment/:comment_id",function(req,res,next) {
    var schema = Joi.object().keys({
        comment_id: Joi.string().guid()
    });

    lib.utils.validate(req.params,schema,function(err){
        if(err){
            lib.utils.sendResponse(res,400,err);
        }
        else{
            req.payload = req.params;
            next();
        }
    });

},controllers.DeleteCommentCtrl);

module.exports = router;