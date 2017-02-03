module.exports = function errorHandlingMiddleware(req, res, next) {
  try {
    next();
  } catch (e) {
    res.status(500).send({ error: e.message || 'Unknown error while processing request' });
  }
};
