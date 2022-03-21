"use strict";
exports.__esModule = true;
var express = require("express");
var router = express.Router();
router.get("/", function (req, res) {
    res.status(200).json({ message: "Get Ingredients" });
});
router.post("/", function (req, res) {
    res.status(200).json({ message: "post Ingredients" });
});
module.exports = router;
