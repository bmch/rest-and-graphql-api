const Person = require('../models/person');
const response = require('../helpers/response');

exports.add = async (ctx) => {
  try {
    const result = await Person.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = response.createOKResponse(result);
  } catch (err) {
    ctx.status = 500;
    ctx.body = response.createFailedResponse(
      'not added',
      'There was a problem adding the person'
    );
  }
};

exports.list = async (ctx) => {
  try {
    const result = await Person.find();
    ctx.body = response.createOKResponse(result);
  } catch (err) {
    console.log(err);
  }
};

exports.findById = async (ctx) => {
  try {
    const person = await Person.findById(ctx.params.id);
    if (!person) {
      ctx.status = 400;
      ctx.body = response.createFailedResponse(
        'not found',
        'That person does not exist'
      );
    } else {
      ctx.body = response.createOKResponse(person);
    }
  } catch (err) {
    if (
      err.name === 'CastError' ||
      err.name === 'NotFoundError' ||
      err.message instanceof mongoose.Error.CastError
    ) {
      ctx.status = 400;
      ctx.body = response.createFailedResponse(
        'not found',
        'That person does not exist'
      );
    } else {
      console.log(err);
      ctx.throw(500);
    }
  }
};

// update

exports.delete = async (ctx) => {
  try {
    const personToRemove = await Person.findByIdAndDelete(ctx.params.id);

    if (!personToRemove) {
      ctx.status = 400;
      ctx.body = response.createFailedResponse(
        'not found',
        'That person does not exist'
      );
    } else {
      ctx.status = 200;
      ctx.body = response.createOKResponse(personToRemove);
    }
  } catch (err) {
    if (
      err.name === 'CastError' ||
      err.name === 'NotFoundError' ||
      err.message instanceof mongoose.Error.CastError
    ) {
      ctx.status = 400;
      ctx.body = response.createFailedResponse(
        'not found',
        'That person does not exist'
      );
    } else {
      console.log(err);
      ctx.throw(500);
    }
  }
};

exports.update = async (ctx) => {
  try {
    const person = await Person.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body,
      { new: true }
    );
    if (!person) {
      ctx.status = 400;
      ctx.body = response.createFailedResponse(
        'not found',
        'That person does not exist'
      );
    } else {
      ctx.body = response.createOKResponse(person);
    }
  } catch (err) {
    if (
      err.name === 'CastError' ||
      err.name === 'NotFoundError' ||
      err.message instanceof mongoose.Error.CastError
    ) {
      ctx.status = 400;
      ctx.body = response.createFailedResponse(
        'not found',
        'That person does not exist'
      );
    } else {
      console.log(err);
      ctx.throw(500);
    }
  }
};
