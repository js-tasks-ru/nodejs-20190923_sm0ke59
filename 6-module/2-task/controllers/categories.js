const Category = require('../models/Category');
const changeCategories = require('../libs/changeCategories');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  const answerToUser = changeCategories(categories);
  ctx.body = {categories: answerToUser};
};
