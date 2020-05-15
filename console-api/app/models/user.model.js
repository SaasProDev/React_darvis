const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const config = require('../../config');

const UserSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    require: true
  },
  owner: {
    type: String,
  },
  levels: {
    type: Array,
    default: [],
    required: false,
  },
  isActive: { type: Boolean, default: true },
  created: { type: Date, default: Date.now }
});

// TODO: Add password strength validator
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(100)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    organization: Joi.string()
      .min(5)
      .max(255)
      .required(),
    role: Joi.string()
      .min(5)
      .max(255)
      .required(),
    owner: Joi.string()
      .min(5)
      .max(255),
    levels: Joi.array(),
    isActive: Joi.boolean()
  };

  return Joi.validate(user, schema);
}

UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      organization: this.organization
    },
    config.jwt_key
  );
};

const User = mongoose.model('User', UserSchema);

exports.User = User;
exports.validate = validateUser;
