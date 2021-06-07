const Joi = require('joi');
const response = require('../helpers/response');

const postSchema = Joi.object({
  name: Joi.string().min(2).max(70).required(),
  age: Joi.number().integer().min(0).max(350).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
});

const signUpSchema = Joi.object({
  firstName: Joi.string().min(1).max(70).required(),
  lastName: Joi.string().min(1).max(70).required(),
  password: Joi.string().min(3).max(15).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
});

const validatePost = async (ctx, next) => {
  const value = postSchema.validate(ctx.request.body);
  if (value.error) {
    ctx.status = 400;
    ctx.body = response.createFailedResponse('invalid', value.error.message);
  } else {
    await next();
  }
};

const validateSignUp = async (ctx, next) => {
  const value = signUpSchema.validate(ctx.request.body);
  if (value.error) {
    ctx.status = 400;
    ctx.body = response.createFailedResponse('invalid', value.error.message);
  } else {
    await next();
  }
};

module.exports = { validatePost, validateSignUp };
