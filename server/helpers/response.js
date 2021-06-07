exports.createOKResponse = (data) => ({
  status: 'success',
  error: 0,
  data,
});

exports.createFailedResponse = (error, message) => ({
  status: 'error',
  error,
  message,
});
