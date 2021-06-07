const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  token: String,
  expiryDate: Date,
});

RefreshTokenSchema.statics.isExpired = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
