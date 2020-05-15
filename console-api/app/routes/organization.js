const express = require('express');
const { pick } = require('lodash');
const router = express.Router();

const Organization = require('../models/organization.model');
const License = require('../models/license.model');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const organization = await Organization.find({}).populate('license', {
      hash: 0,
      salt: 0,
      licenseKey: 0
    });

    return res.json(organization);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    let organization = new Organization(
      pick(req.body, ['name', 'site', 'license'])
    );

    organization = await organization.save();
    organization.license = await License.findOne({
      _id: organization.license
    }).select({
      _id: 1,
      name: 1,
      allowedUsers: 1,
      expiry: 1,
      created: 1
    });

    return res.json(organization);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const organization = await Organization.findOne({ _id: id }).populate(
      'license',
      {
        hash: 0,
        salt: 0,
        licenseKey: 0
      }
    );

    if (organization) {
      return res.json(organization);
    }

    return res.status(404).send('Organization not found');
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const license = await License.findOne({
      _id: req.body.license
    }).select({
      _id: 1,
      name: 1,
      allowedUsers: 1,
      expiry: 1,
      created: 1
    });

    if (!license) {
      return res.status(400).send('Invalid License');
    }

    const { id } = req.params;
    let organization = await Organization.findOneAndUpdate(
      { _id: id },
      {
        ...pick(req.body, ['name', 'site']),
        license: req.body.license
      },
      { new: true }
    );

    if (!organization) {
      return res.status(404).send('Organization not found');
    }

    organization.license = license;

    return res.json(organization);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const organization = await Organization.findByIdAndRemove(req.params.id);
    if (!organization) {
      return res.status(400).send('Organization not found');
    }
    return res.send(organization);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.get('/bylicense/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const org = await Organization.findOne({license : id});
    if(!org) {
      return res.json('Invalid license');
    }
    return res.json(org);
  } catch(e) {
    return res.status(503).send(e.message);
  }
});

module.exports = router;
