const User = require("../../models/User");

const validateName = async function (req, res, next) {
  try {
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      throw new Error("중복되는 이름입니다.");
    }

    next();
  } catch (error) {
    next(error);
  }
}

const validateSessionAndRedirect = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      res.redirect("/");
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}

const validateSessionAndContinue = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect("/login");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateName,
  validateSessionAndRedirect,
  validateSessionAndContinue,
};
