const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || `ERROR IN BACKEND {ERROR-HANDLER-MIDDLEWARE}`,
  };

  if (err.code && err.code === 11000) {
    customError.message = `Already Registered`;
    customError.statusCode = 400;
  }

  res.status(customError.statusCode).json(customError);
};

module.exports = { errorHandlerMiddleware };
