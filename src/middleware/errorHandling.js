module.exports = function errorHandlingMiddleware(request, response, next) {
  try {
    next();
  } catch (e) {
    console.error("Unexpected error: " + e.message);
  }
};
