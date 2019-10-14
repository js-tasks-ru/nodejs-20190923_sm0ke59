const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  let categories = await Category.find();
  categories = categories
    .map(item => {
      return {...item.toJSON(), id: item._id }
    })
    .map( item => { 
      delete(item._id)
      delete(item.__v)
      return item })
      .map(item => {
        if(item.subcategories.length) {
        item.subcategories = item.subcategories.map(i => {
            return { ...i, id: i._id}
          })
          .map(i => {
            delete(i._id)
            return i
          })
        }
        return item
      })
  console.log(categories);
  ctx.body = {categories} ;
};
