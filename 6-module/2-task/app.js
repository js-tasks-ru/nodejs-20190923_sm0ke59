const Koa = require('koa');
const Router = require('koa-router');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');
const Product = require('./models/Product');
const Category = require('./models/Category');

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

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);
router.post('/create', async (ctx) => {
  const category = await Category.find()
  console.log(category)
  const product = await Product.create({
      title: 'Product1',
        description: 'Description1',
        price: 10,
        category: category[0]._id,
        subcategory: category[0].subcategories[0].id,
        images: ['image1'],
  })
  ctx.body = product
})

app.use(router.routes());

module.exports = app;
