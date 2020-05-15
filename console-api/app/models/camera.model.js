const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CameraSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: true,
    minlength: 3,
    maxlength: 15
  },
  type: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  levelId: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    required: true
  },
  user: {
    type: String,
    default: '',
    required: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  points: Schema.Types.Mixed,     // cam_res_x, cam_res_y, src_points, dst_points, homography, ai_roi
  created: { type: Date, default: Date.now }
});

const Camera = mongoose.model('Camera', CameraSchema);

module.exports = Camera;
