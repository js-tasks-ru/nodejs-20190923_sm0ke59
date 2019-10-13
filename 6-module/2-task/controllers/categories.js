const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  console.log({categories})
  ctx.body = {categories} ;
};
