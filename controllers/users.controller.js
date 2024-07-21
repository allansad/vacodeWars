const User = require("../models/User");
const bcrypt = require("bcrypt");

const createUser = async function (req, res, next) {
  try {
    if (req.body.username && req.body.password) {
      const username = String(req.body.username);
      const saltRounds = Number(process.env.SALT_ROUNDS);
      const password = bcrypt.hashSync(req.body.password, saltRounds);
      await User.create({ username, password });

      res.redirect("/login");
    } else {
      throw new Error("username과 password를 입력하세요");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser };
