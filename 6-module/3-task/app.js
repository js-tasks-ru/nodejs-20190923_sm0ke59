const Koa = require('koa');
const Router = require('koa-router');
const {productsByQuery} = require('./controllers/products');
// const Category = require('./models/Category');
// const Product = require('./models/Product');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router({prefix: '/api'});

router.get('/products', productsByQuery);
// router.post('/createCat', async (ctx) => {
//   const category = await Category.create({
//     title: 'Category1',
//     subcategories: [{
//       title: 'Subcategory1',
//     }],
//   });
//   ctx.body = category;
// });
// router.post('/createProd', async (ctx) => {
//   const category = await Category.find();
//   console.log(category[0].subcategories);
//   const product1 = await Product.create({
//    title: 'ProductA',
//       description: 'better than ProductB',
//       price: 10,
//       category: category[0].id,
//       subcategory: category[0].subcategories[0].id,
//       images: ['image1'],
//   });
//    const product2 = await Product.create({
//    title: 'ProductB',
//       description: 'better than ProductA',
//       price: 10,
//       category: category[0].id,
//       subcategory: category[0].subcategories[0].id,
//       images: ['image1'],
//   });
// });

app.use(router.routes());

module.exports = app;
