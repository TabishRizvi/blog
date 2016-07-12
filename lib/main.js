/**
 * Created by Tabish Rizvi
 */

"use strict";
var db = require("../db"),
    DBConstants = require("../DB_Const"),
    uuid = require("uuid"),
    _ = require("underscore");

module.exports.getIdFromUUID = function(uuid,type,cb) {
    if(_.indexOf(["posts","paragraphs","comments"],type)===-1) {
        throw new Error("wrong type");
    }

    var idKey = DBConstants[type].tableID;
    var sql = "SELECT * FROM "+type+" WHERE uuid = ?";
    var params = [uuid];
    db.query(sql,params,function(err,result) {
       if(err){
           cb(err);
       }
       else if(result.length===0) {
           cb(404);
       }
       else {
           cb(null,result[0][idKey]);
       }
    });
};

module.exports.getOrderKey = function(type,criteria) {
    return DBConstants[type].orderKeys[criteria];
};




