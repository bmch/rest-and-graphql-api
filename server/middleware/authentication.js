const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config');

const getAuthTokenFromRequest = (header) => {
  const [bearer, token] = header.split(' ');
  return bearer === 'Bearer' && token ? token : null;
};

exports.authJWT = async (ctx, next) => {
  try {
    if (!ctx.headers.authorization) ctx.throw(403, 'No token.');
    const token = getAuthTokenFromRequest(ctx.headers.authorization);
    if (!token) {
      // ctx.throw(403, 'No token.');
      throw new Error('No Authentication token.');
    }
    let userId;
    jwt.verify(token, JWT_SECRET_KEY, (err, jwtPayload) => {
      if (err) {
        throw new Error('From verify -' + err.message);
      }
      userId = jwtPayload.sub;
    });

    if (!userId) {
      throw new Error('Authentication token did not have a user id.');
    }
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('Authentication token is invalid: User not found.');
    }
    ctx.request.currentUser = user;
    await next();
  } catch (err) {
    console.log(err);
    ctx.throw(err.status || 403, err.text);
  }
};
