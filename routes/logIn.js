const express = require("express");
const passport = require("passport");

const { validateSessionAndRedirect } = require("./middlewares/validation");

const router = express.Router();

router.post("/", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
}));

router.get("/", validateSessionAndRedirect, (req, res, next) => {
  try {
    const message = req.flash();

    if (Object.keys(message).length === 0) {
      message.error = ["로그인 후 이용하세요."];
    }

    res.render("login", { message: message.error });
  }
  catch (error) {
    next(error);
  }
});

module.exports = router;
