const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  site: String,
  license: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'License'
  },
  created: { type: Date, default: Date.now }
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;
