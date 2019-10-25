const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, password, displayName} = ctx.request.body;
  const user = await User.findOne({email});
  if (user) return ctx.throw(400, {errors: {email: 'Такой email уже существует'}});
  const verificationToken = uuid();
  const newUser = new User({
    email,
    displayName,
    verificationToken,
  });
  await newUser.setPassword(password);
  await newUser.save();
  await sendMail({
    template: 'confirmation',
    locals: {token: verificationToken},
    to: newUser.email,
    subject: 'Подтвердите почту',
  });
  ctx.status = 200;
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  if (!verificationToken) {
    return ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }
  const user = await User.findOne({verificationToken});
  if (!user) {
    return ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }
  user.verificationToken = undefined;
  await user.save();
  const token = await ctx.login(user);
  ctx.body = {token};
};
