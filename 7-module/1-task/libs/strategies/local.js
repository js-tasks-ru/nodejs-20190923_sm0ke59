const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');


module.exports = new LocalStrategy(
    {
     session: false,
     usernameField : 'email',
    },
    async function(email, password, done) {
      const user = await User.findOne({email});
      if (!user) return done(null, false, 'Нет такого пользователя' );
      const validPassport = await user.checkPassword(password);
      if (!validPassport) return done(null, false, 'Невереный пароль' );
      done(null, user)
    }
);
