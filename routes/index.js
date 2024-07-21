const express = require("express");

const Problem = require("../models/Problem");
const runCode = require("../controllers/problems.controller");
const { validateSessionAndContinue } = require("./middlewares/validation");

const router = express.Router();

router.get("/", validateSessionAndContinue, async (req, res, next) => {
  try {
    const problems = await Problem.find();
    res.render("index", { problems });
  } catch (error) {
    next(error);
  }
});

router.get("/problems/:problem_id", validateSessionAndContinue, async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.problem_id);
    res.render("problem", { problem });
  } catch (error) {
    next(error);
  }
});

router.post("/problems/:problem_id", validateSessionAndContinue, async (req, res, next) => {
  try {
    const userInput = req.body.code;
    const { tests: problems } = await Problem.findById(req.params.problem_id);

    let isAllPassed = true;
    const failedTests = [];

    for (const test of problems) {
      const userAnswer = await runCode(userInput, test.code);

      if (userAnswer !== test.solution) {
        isAllPassed = false;
        failedTests.push(test);
      }
    }

    if (isAllPassed) {
      res.render("success");
      return;
    }

    res.render("failure", { result: failedTests });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
