import { PrismaErrorHandler } from "./prismaErrorHandler.js";

export const errorHandler = (err, req, res, next) => {
  console.log(err)
  const processedError = PrismaErrorHandler.handle(err);

  processedError.statusCode = processedError.statusCode || 500;
  processedError.status = processedError.status || 'error';

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (processedError.isDatabaseError) {
    err.statusCode = processedError.statusCode || 500;
    err.status = processedError.status || 'error';
    err.message=processedError.message || "Somethong went wrong!"
    err.isOperational=processedError.isOperational || false
  }

  console.log(err);

  const handleDevelopmentError = (err) => {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      metadata: err.metadata,
      stack: err.stack,
      ...(err.metadata && { metadata: err.metadata })
    });
  };

  const handleProductionError = (err) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {

      if(err.statusCode==500){
        return res.status(err.statusCode).json({
          status: 'error',
          message: 'Something went wrong!',
        });
      }

      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
       
      });
    }

    // Programming or other unknown error: don't leak error details
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  };

  if (process.env.NODE_ENV === 'development') {
    handleDevelopmentError(err);
  } else {
    handleProductionError(err);
  }
};