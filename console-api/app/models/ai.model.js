const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AISchema = new Schema({
  version: {
    type: Number,
    default: 1,
    required: true,
  },
  containerURL: {
    type: String,
    default: null,
    required: false,
    minlength: 5,
    maxlength: 100
  },
  classes: Schema.Types.Mixed,
  data: Schema.Types.Mixed,
});

const AI = mongoose.model('ai', AISchema);

module.exports = AI;
