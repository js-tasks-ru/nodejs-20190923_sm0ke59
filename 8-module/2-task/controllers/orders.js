const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Product = require('../models/Product');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const {_id, email} = ctx.user;
  const order = await Order.create({user: _id, product, phone, address});
  const productInfo = await Product.findById(product);

  await sendMail({
    template: 'order-confirmation',
    locals: {id: order._id, product: productInfo},
    to: email,
    subject: 'Подтвердите заказ',
  });
  ctx.status = 200;
  ctx.body = {order: order._id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const order = await Order.find({user: ctx.user._id}).populate('Product');
  if (!order) return ctx.throw(400, 'У Вас нет заказов');
  ctx.status = 200;
  ctx.body = {orders: order};
};
