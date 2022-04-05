// Constructor and object instances
export function APIfeatures(this: any, query: any, queryString: any) {
  this.query = query; // Ingredient.find()
  this.queryString = queryString; //req.query

  console.log(this.query);
  console.log(this.queryString);

  this.paginating = () => {
    const page: number = Number(this.queryString.page) || 1;
    const limit: number = Number(this.queryString.limit) || 10;
    const skip = limit * (page - 1);

    this.query = this.query.limit(limit).skip(skip);
    return this;
  };
}
