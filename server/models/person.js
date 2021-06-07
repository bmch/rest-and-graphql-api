const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
  id: mongoose.ObjectId,
  name: { type: String, required: true },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  age: { type: Number, required: true },
});

module.exports = mongoose.model('Person', personSchema);
