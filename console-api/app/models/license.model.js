const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addOneYear = () => {
  const date = new Date();

  const y = date.getFullYear();
  const d = date.getDate();
  const m = date.getMonth();

  return new Date(y + 1, m, d);
};

const LicenseSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: true
  },
  allowedUsers: {
    type: Number,
    required: true,
    default: 1
  },
  licenseKey: {
    type: String,
    default: Math.floor(new Date().valueOf() * Math.random())
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  salt: {
    type: String
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  expiry: { type: Date, default: addOneYear() },
  created: { type: Date, default: Date.now }
});

const License = mongoose.model('License', LicenseSchema);

module.exports = License;
