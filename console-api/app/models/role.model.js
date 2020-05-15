const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  created: { type: Date, default: Date.now }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
