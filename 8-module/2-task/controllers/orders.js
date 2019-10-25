const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Product = require('../models/Product');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const user = ctx.user;
  const order = new Order({user: user._id, product, phone, address});
  await order.save();
  const {id} = order;
  const productInfo = await Product.findById(product);

  await sendMail({
    template: 'order-confirmation',
    locals: {id, product: productInfo},
    to: user.email,
    subject: 'Подтвердите заказ',
  });
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const order = await Order.find({user: ctx.user._id}).populate('Product');
  ctx.body = {order: [order]};
};
