const ivm = require("isolated-vm");
const isolate = new ivm.Isolate();

const context = isolate.createContextSync();

const runCode = async function (userInput, testInput) {
  try {
    const script = isolate.compileScriptSync(`
      (function() {
        ${userInput}
        return ${testInput};
      })();
    `);
    return await script.run(context);
  } catch (error) {
    res.render("failure", { result: error.message });
  }
}

module.exports = runCode;
