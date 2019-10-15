function changeProduct(product) {
  const {__v, _id, ...object} = product;
  return {...object, id: _id};
}

module.exports = changeProduct;
