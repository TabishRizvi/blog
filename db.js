/**
 * Created by Tabish Rizvi
 */

"use strict";
var config = require("./config"),
    mysql = require("mysql");

var pool = mysql.createPool(config.mysql);

module.exports.query = function (sql, params, cb) {
    pool.getConnection(function (err, connection) {
        if(err) {
            throw err;
        }
        connection.query(sql, params, function () {
            cb.apply(this, arguments);
            connection.release();
        });
    });
};