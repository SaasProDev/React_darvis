const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SiteSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: true,
    minlength: 3,
    maxlength: 50
  },
  dwInfo: Schema.Types.Mixed,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created: { type: Date, default: Date.now },
  levels: Schema.Types.Mixed,
  cameras: Schema.Types.Mixed,
  ai: Schema.Types.Mixed,
  data: Schema.Types.Mixed,
});

const Site = mongoose.model('Site', SiteSchema);

module.exports = Site;
