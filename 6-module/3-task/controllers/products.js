const Products = require('../models/Product');
const changeProduct = require('../../2-task/libs/changeProduct');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  if (!query) ctx.throw(400, 'Empty request');
  const products = await Products.find({$text: {$search: query}});
  ctx.body = {products: changeProduct(products)};
};
