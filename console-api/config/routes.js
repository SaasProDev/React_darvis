'use strict';
const path = require('path');

const ai = require('../app/routes/ai');
const role = require('../app/routes/role');
const sites = require('../app/routes/sites');
const user = require('../app/routes/user');
const auth = require('../app/routes/auth');
const license = require('../app/routes/license');
const organization = require('../app/routes/organization');
const licenseValidation = require('../app/routes/licenseValidation');
const camera = require('../app/routes/camera');

module.exports = function(app) {
  app.get('/', function(req, res) {
    //res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });

  app.use('/api/ai', ai);
  app.use('/api/auth', auth);
  app.use('/api/sites', sites);
  app.use('/api/role', role);
  app.use('/api/users', user);
  app.use('/api/license', license);
  app.use('/api/organization', organization);
  app.use('/api/validateLicense', licenseValidation);
  app.use('/api/cameras', camera);

  /**
   * Error handling
   */

  app.use(function(err, req, res, next) {
    // treat as 404
    if (
      err.message &&
      (~err.message.indexOf('not found') ||
        ~err.message.indexOf('Cast to ObjectId failed'))
    ) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
