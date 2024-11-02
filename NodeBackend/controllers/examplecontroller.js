const asyncHandler = require("express-async-handler");

exampleHandler = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Example Page");
});


module.exports = {exampleHandler}