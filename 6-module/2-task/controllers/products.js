const Products = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const products = await Products.find()
  ctx.body = {products: products};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {products: []};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.request.url.split('/').slice(-1).join('');
  const product = await Products.find({ _id: id})
  if (product.length) {
    ctx.body = {product: product[0]};
  } else {
    ctx.status = 404;
    ctx.body = {error: 'Product not found'};
  }
};

