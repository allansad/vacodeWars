const express = require("express");

const usersController = require("../controllers/users.controller");
const { validateName, validateSessionAndRedirect } = require("./middlewares/validation");

const router = express.Router();

router.post("/", validateName, usersController.createUser);

router.get("/", validateSessionAndRedirect, (req, res, next) => {
  try {
    res.render("signUp");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
