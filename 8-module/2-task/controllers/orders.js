const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Product = require('../models/Product');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body; // получили параметры из запроса
  const {_id, email} = ctx.user; // получили пользователя
  const order = await Order.create({user: _id, product, phone, address}); // создаем заказ в базе
  const productInfo = await Product.findById(product); // ищем продукты в базе по id

  await sendMail({ // отправляем на почту ид заказа и заголовок продукта
    template: 'order-confirmation',
    locals: {id: order._id, product: productInfo},
    to: email,
    subject: 'Подтвердите заказ',
  });
  ctx.status = 200;
  ctx.body = {order: order._id}; // отправляем в ответ на запрос ид заказа
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  // ищем заказы и разворачиваем их по product
  const order = await Order.find({user: ctx.user._id}).populate('Product');
  if (!order) return ctx.throw(400, 'У Вас нет заказов'); // ничего нет
  ctx.status = 200;
  ctx.body = {orders: order}; // отправляем заказы в виде массива
};
