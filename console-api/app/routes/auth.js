const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');

const { User } = require('../models/user.model');
const Role = require('../models/role.model');
const Organization = require('../models/organization.model');
const { auth } = require('../middleware/auth.js');

function validate(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(100)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

router.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('Invalid user');
    }

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(400).send('Invalid password');
    }

    const role = await Role.findOne({ _id: user.role });
    const organization = await Organization.findOne({
      _id: user.organization
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      owner: user.owner,
      levels: user.levels,
      token: user.generateAuthToken(),
      role,
      organization
    });
  } catch (e) {
    res.status(503).send(e.message);
  }
});

router.get('/me', auth, async function(req, res) {
  const user = await User.findById(req.user._id)
    .select({
      password: 0,
      salt: 0
    })
    .populate('role')
    .populate('organization');
  res.send(user);
});

module.exports = router;
