function changeProduct(product) {
  if (Array.isArray(product)) {
    return product.map((prod) => {
      const {__v, _id, ...object} = prod.toJSON();
      return  {...object, id: _id};
    });
  } else {
    const {__v, _id, ...object} = product;
    return {...object, id: _id};
  }
}

module.exports = changeProduct;
