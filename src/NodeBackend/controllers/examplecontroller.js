import asyncHandler from "express-async-handler";




const exampleHandler = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Example Page");
});
console.log(exampleHandler)

export default {exampleHandler}