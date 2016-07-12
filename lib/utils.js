/**
 * Created by Tabish Rizvi
 */

"use strict";
var Joi = require("joi"),
    uuid = require("uuid"),
    _ = require("underscore"),
    HTTPStatus = require("http-status");

module.exports.validate = function(dataObject,schema,cb) {
    Joi.validate(dataObject,schema,{presence : "required"},function(err){
        if(err){
            cb(err.details[0].message.replace(/["]/ig, ""));
        }
        else{
            cb(null);
        }
    });
};

module.exports.getUUID = function() {
    return uuid.v4();
};

module.exports.sendResponse = function(res,status,data) {
    var responseObj =  {
        status : status,
        message : HTTPStatus[status]
    };
    if(!_.isUndefined(data)) {
        responseObj.data = data;
    }
    return res.status(status).send(responseObj);
};



