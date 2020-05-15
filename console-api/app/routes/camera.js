const express = require('express');
const { pick } = require('lodash');
const router = express.Router();

const Camera = require('../models/camera.model');
const { auth } = require('../middleware/auth');

const returnAble = [
  '_id',
  'name',
  'type',
  'isActive',
  'ip',
  'username',
  'created'
];

router.get('/', auth, async (req, res) => {
  try {
    const cameras = await Camera.find({});

    return res.json(cameras);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    let camera = new Camera(
      pick(req.body, ['name', 'type', 'isActive', 'ip', 'user', 'pass'])
    );
    camera = await camera.save();

    return res.json(pick(camera, returnAble));
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const camera = await Camera.findOne({ _id: id });

    if (camera) {
      return res.json(camera);
    }

    return res.status(404).send('Camera not found');
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    let camera = await Camera.findOneAndUpdate(
      { _id: id },
      pick(req.body, ['name']),
      { new: true }
    );

    if (!camera) {
      return res.status(404).send('Camera not found');
    }

    return res.json(pick(camera, returnAble));
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const camera = await Camera.findByIdAndDelete(req.params.id);
    if (!camera) {
      return res.status(400).send('Camera not found');
    }
    return res.send(pick(camera, returnAble));
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

module.exports = router;
