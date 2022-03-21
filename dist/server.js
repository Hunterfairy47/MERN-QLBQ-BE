"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var auth_1 = __importDefault(require("./routes/auth"));
var express = require("express");
var dotenv = require("dotenv").config();
var port = process.env.PORT || 5000;
var app = express();
app.use(express.json());
app.use("/auth", auth_1["default"]);
app.listen(port, function () { return console.log("Server started at port ".concat(port)); });
