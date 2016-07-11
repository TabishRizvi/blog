/**
 * Created by Tabish Rizvi
 */

var express = require("express"),
    controllers = require("../controllers");

var router = express.Router();

router.get("/profile/view",controllers.api.user.ProfileViewCtrl);


module.exports = router;