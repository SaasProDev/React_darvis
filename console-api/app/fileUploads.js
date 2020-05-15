const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, path.join('./public/uploads'));
    },
    filename: function(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    }
  })
});
