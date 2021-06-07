const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const RefreshToken = require('../models/refresh-token');
const response = require('../helpers/response');
const {
  JWT_SECRET_KEY,
  REFRESH_TOKEN_SECRET,
  tokenLife,
  refreshTokenLife,
} = require('../config');

exports.login = async (ctx) => {
  try {
    const { email, password } = ctx.request.body;
    let loadedUser;
    const user = await User.findOne({ email });
    if (!user) {
      ctx.status = 400;
      ctx.body = response.createFailedResponse(
        'User not found.',
        'Could not find your account'
      );
    }
    loadedUser = user;

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      ctx.status = 422;
      ctx.body = response.createFailedResponse(
        'Wrong password.',
        'Passwords do not match'
      );
    } else {
      const userDetails = {
        sub: loadedUser._id.toString(),
      };

      const token = jwt.sign(userDetails, JWT_SECRET_KEY, {
        expiresIn: tokenLife,
      });

      const refreshToken = jwt.sign(userDetails, REFRESH_TOKEN_SECRET, {
        expiresIn: refreshTokenLife,
      });

      const refreshToSave = new RefreshToken({
        user: loadedUser._id,
        token: refreshToken,
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await refreshToSave.save();

      ctx.status = 200;
      ctx.body = {
        token,
        refreshToken,
        message: 'Successful Authentication',
      };
    }
  } catch (error) {
    ctx.status = 401;
    ctx.body = {
      message: 'Authentication Failed',
    };
    console.log(error);
  }
};

exports.signup = async (ctx) => {
  try {
    const { email, password, firstName, lastName } = ctx.request.body;
    const hashedPw = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPw,
      firstName,
      lastName,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign(
      {
        sub: savedUser._id.toString(),
      },
      JWT_SECRET_KEY,
      { expiresIn: '10 hours' }
    );

    ctx.status = 201;
    ctx.body = {
      user: {
        id: savedUser._id.toString(),
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      },
      token,
    };
  } catch (err) {
    console.log(err);
  }
};

exports.refreshToken = async (ctx) => {
  try {
    const { refreshToken } = ctx.request.body;
    if (!refreshToken) {
      throw new Error('no refresh token found in request');
    }

    const foundToken = await RefreshToken.findOne({ token: refreshToken });

    if (!foundToken) {
      throw new Error('no refresh token found in db');
    }
    // only checking db for expiry not the JWT verification

    if (RefreshToken.isExpired(foundToken)) {
      RefreshToken.findByIdAndRemove(foundToken._id, {
        useFindAndModify: false,
      }).exec();

      throw new Error(
        'Refresh token was expired. Please make a new signin request'
      );
    }

    const newJwtToken = jwt.sign({ sub: foundToken.user._id }, JWT_SECRET_KEY, {
      expiresIn: tokenLife,
    });

    const result = {
      token: newJwtToken,
      refreshToken: foundToken.token,
    };

    ctx.body = response.createOKResponse(result);
  } catch (err) {
    ctx.status = 403;
    ctx.body = response.createFailedResponse(err.message);
    console.log(err);
  }
};

exports.logout = async (ctx) => {
  const { token } = ctx.request.body;
  // delete the refresh token
  ctx.body = response.createOKResponse('Logout successful');
};
