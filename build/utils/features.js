"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIfeatures = void 0;
// Constructor and object instances
function APIfeatures(query, queryString) {
    this.query = query; // Ingredient.find()
    this.queryString = queryString; //req.query
    console.log(this.query);
    console.log(this.queryString);
    this.paginating = () => {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 10;
        const skip = limit * (page - 1);
        this.query = this.query.limit(limit).skip(skip);
        return this;
    };
}
exports.APIfeatures = APIfeatures;
