
export const appError = (message, statusCode) => {
  console.log({errorMessage: message});
  const error = new Error(message);
  error.statusCode = statusCode || 500;
  error.stack = error.stack;
  return error;
}

export const globalErrorHandler = (
  error,
  request,
  response,
  next) => {

  const stack = error.stack;
  const message = error.message;
  const status = error?.status || 'failed';
  const statusCode = error.statusCode || 500;

  response.status(statusCode).json({
    message,
    status,
    ...(stack && { stack }),
  });
}