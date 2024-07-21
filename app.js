require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("./controllers/passport.controller");
const index = require("./routes/index");
const logIn = require("./routes/logIn");
const signUp = require("./routes/signUp");

const app = express();

app.set("view engine", "ejs");

mongoose.connect(process.env.DATABASE);

app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/login", logIn);
app.use("/signup", signUp);
app.use("/", index);

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  if (err.message === "중복되는 이름입니다.") {
    err.status = 409;
  }

  // if (err instanceof mongoose.Error.ValidationError) {
  //   err.status = 400;
  //   err.message = "입력한 데이터의 형식이 올바르지 않습니다.";
  // } else if (err instanceof mongoose.Error.CastError) {
  //   err.status = 400;
  //   err.message = "잘못된 요청입니다.";
  // } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
  //   err.status = 404;
  //   err.message = "해당하는 데이터를 찾을 수 없습니다.";
  // } else if (err instanceof mongoose.Error.VersionError) {
  //   err.status = 409;
  //   err.message = "데이터를 동시에 수정할 수 없습니다.";
  // } else if (err instanceof mongoose.Error.OverwriteModelError) {
  //   err.status = 500;
  //   err.message = "데이터베이스 구조를 재정의 할 수 없습니다.";
  // } else if (err instanceof mongoose.Error.MissingSchemaError) {
  //   err.status = 500;
  //   err.message = "데이터베이스 구조가 정의되지 않았습니다.";
  // } else if (err instanceof mongoose.Error.StrictModeError) {
  //   err.status = 400;
  //   err.message = "데이터베이스 구조에 맞지 않는 데이터입니다.";
  // } else if (err instanceof mongoose.Error.DisconnectedError) {
  //   err.status = 503;
  //   err.message = "데이터베이스에 연결할 수 없습니다.";
  // } else if (err.code === 11000) {
  //   err.status = 409;
  //   err.message = "중복되는 데이터 입니다.";
  // } else if (err instanceof mongoose.Error.ParallelSaveError) {
  //   err.status = 500;
  //   err.message = "동시에 저장할 수 없습니다.";
  // }

  res.locals.message = err.message ? err.message : "Internal Server Error";
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
