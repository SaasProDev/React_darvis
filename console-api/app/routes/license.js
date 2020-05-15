const express = require('express');
const { pick } = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();

const License = require('../models/license.model');
const { auth } = require('../middleware/auth');
const {generateKey} = require('../utils');

const returnAble = ['_id', 'name', 'allowedUsers', 'licenseKey', 'isActive', 'created', 'expiry'];

router.get('/', auth, async (req, res) => {
  try {
    const license = await License.find({}).select({
      name: 1,
      allowedUsers: 1,
      licenseKey: 1,
      isActive: 1,
      expiry: 1,
      created: 1
    });

    return res.json(license);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    let license = new License(pick(req.body, ['name', 'allowedUsers', 'isActive', 'expiry']));

    license.licenseKey = generateKey(7);

    license.salt = await bcrypt.genSalt(10);
    license.hash = await bcrypt.hash(license.licenseKey, license.salt);

    license = await license.save();

    return res.json(pick(license, returnAble));
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const license = await License.findOne({ _id: id }).select({
      name: 1,
      allowedUsers: 1,
      licenseKey: 1,
      isActive: 1,
      expiry: 1,
      created: 1
    });

    if (license) {
      return res.json(license);
    }

    return res.status(404).send('License not found');
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    let license = await License.findOneAndUpdate(
      { _id: id },
      pick(req.body, ['name', 'allowedUsers', 'isActive', 'expiry']),
      { new: true }
    );

    if (!license) {
      return res.status(404).send('License not found');
    }

    return res.json(pick(license, returnAble));
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const license = await License.findByIdAndDelete(req.params.id);
    if (!license) {
      return res.status(400).send('License not found');
    }
    return res.send(pick(license, returnAble));
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.post('/validate', async(req, res) => {
  try {
    let license = await License.findOne({ licenseKey : req.body.license});
    if(!license) {
      return res.json('Invalid license');
    }
    return res.json(license);
  } catch (e) {
    return res.status(503).send(e.message);
  }
}) 

module.exports = router;
