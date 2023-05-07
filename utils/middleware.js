const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const unknownEndpoint = (request, response) => {
  response.status(400).send({ error: "unknown endpoint" });
};

const requestLogger = (request, response, next) => {
  logger.info("Method", request.method);
  logger.info("Path", request.path);
  logger.info("Body", request.body);
  logger.info("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === "MongoServerError") {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === "TypeError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("bearer ")) {
    request.token = authorization.replace("bearer ", "");
  }
  next();
};
const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const findUser = await User.findById(decodedToken.id);
    request.user = findUser;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = {
  unknownEndpoint,
  requestLogger,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
