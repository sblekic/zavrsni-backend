export const errorHandler = (err, req, res, next) => {
  let date = new Date();
  console.log("CUSTOM ERROR HANDLER " + date.toTimeString().split(" ")[0]);
  console.log(err);
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
  });
};
