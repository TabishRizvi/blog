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


module.exports = router;