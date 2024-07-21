const passport = require("passport");
const bcrypt = require("bcrypt")
const User = require("../models/User");
const LocalStrategy = require("passport-local");

const authenticateUser = async function (username, password, done) {
  try {
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return done(null, false, { message: "사용자를 찾을 수 없습니다." });
    }

    const isPasswordMatched = bcrypt.compareSync(password, existingUser.password);

    if (!isPasswordMatched) {
      return done(null, false, { message: "비밀번호가 일치하지 않습니다." });
    }

    return done(null, existingUser);
  } catch (error) {
    return done(error);
  }
}

passport.use(new LocalStrategy(authenticateUser));

passport.serializeUser((user, password, done) => {
  try {
    done(null, user.user._id);
  } catch {
    done(error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
    console.error(error);
  }
});

module.exports = passport;
