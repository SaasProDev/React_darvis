const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { pick } = require('lodash');

const License = require('../models/license.model');
const { auth } = require('../middleware/auth');

router.post('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    let license = await License.findOne({ _id: id });

    if (!license) {
      return res.status(400).send('Invalid License');
    }

    let licenseKey = license.licenseKey;

    if (req.body && req.body.licenseKey) {
      licenseKey = req.body && req.body.licenseKey;
    }

    const valid = await bcrypt.compare(licenseKey, license.hash);
    if (!valid) {
      return res.status(400).send('Invalid License');
    }

    return res.json(
      pick(license, ['_id', 'name', 'allowedUsers', 'licenseKey', 'isActive'])
    );
  } catch (e) {
    res.status(503).send(e.message);
  }
});

module.exports = router;
