"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertionTable = void 0;
const convertionTable = (ingredientName, amount) => {
    switch (ingredientName) {
        case "Dầu ăn":
            return (amount / 1000 / 1.24) * 1000;
        case "Trứng gà ta":
            return;
        default:
            break;
    }
};
exports.convertionTable = convertionTable;
