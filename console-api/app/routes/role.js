const express = require('express');
const { pick } = require('lodash');
const router = express.Router();

const Role = require('../models/role.model');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const role = await Role.find({});

    return res.json(role);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    let role = new Role(pick(req.body, ['name', 'key']));

    role = await role.save();

    return res.json(role);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findOne({ _id: id });

    if (role) {
      return res.json(role);
    }

    return res.status(404).send('Role not found');
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const role = await Role.findByIdAndRemove(req.params.id);
    if (!role) {
      return res.status(400).send('Role not found');
    }
    return res.send(role);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

module.exports = router;
