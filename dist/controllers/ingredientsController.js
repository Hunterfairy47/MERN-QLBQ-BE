"use strict";
exports.__esModule = true;
var getIngredients = function (req, res) {
    res.status(200).json({ message: "Get Ingredients" });
};
module.exports = {
    getIngredients: getIngredients
};
