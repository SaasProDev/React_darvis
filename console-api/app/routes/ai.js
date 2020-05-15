const express = require('express');
const { pick } = require('lodash');
const router = express.Router();

const AI = require('../models/ai.model');
const { auth } = require('../middleware/auth');

const returnAble = ['_id', 'version', 'containerURL', 'classes']

router.get('/', auth, async (req, res) => {
  try {
    const ai = await AI.find({});
    return res.json(ai);
  } catch(e) {
    return res.status(503).send(e.message);
  }
})

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const ai = await AI.findOne({ _id: id });

    if (ai) {
      return res.json(ai);
    }

    return res.status(404).send('AI not found');
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.post('/', async(req, res) =>{
  try {
    let ai = new AI(pick(req.body, ['version', 'classes']));

    let = await ai.save();
    return res.json(pick(ai, returnAble));
  } catch(e) {
    return res.status(503).send(e.message);
  }
});


module.exports = router;
