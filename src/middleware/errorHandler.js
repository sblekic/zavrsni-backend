export const errorHandler = (err, req, res, next) => {
  console.log("ERROR HANDLER " + Date.now());
  console.log(err);
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
  });
};
