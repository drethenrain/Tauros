const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    _id: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = model('User', schema);
