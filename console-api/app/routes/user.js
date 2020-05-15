const express = require('express');
const { pick } = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const { User, validate } = require('../models/user.model');
const Role = require('../models/role.model');
const Site = require('../models/site.modal');
const Organization = require('../models/organization.model');
const { auth } = require('../middleware/auth.js');

const router = express.Router();

// get all users
router.get('/', auth, async (req, res) => {
  // const pageNumber = 1;
  // const pageSize = 10;

  try {
    const users = await User.find({})
      .select({
        password: 0,
        salt: 0
      })
      .populate('organization')
      .populate('role');
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize);

    res.json(users);
  } catch (e) {
    res.status(503).send(e.message);
  }
});

router.get('/byOwner/:id', auth, async (req, res) => {
  const {id} = req.params;
  try {
    const users = await User.find({owner: id})
      .select({
        password: 0,
        salt: 0
      })
      .populate('organization')
      .populate('role');
    if(users) {
      return res.json(users);
    }
  } catch(e) {
    res.status(503).send(e.message);
  }
});

// get user by id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id })
      .select({
        password: 0,
        salt: 0
      })
      .populate('organization')
      .populate('role');
    if (user) {
      return res.json(user);
    }

    return res.status(404).send('User not found');
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send('User already registered');
    }

    let role;
    if (req.body.role) {
      role = await Role.findOne({ _id: req.body.role });
      if (!role) {
        return res.status(400).send('Invalid Role');
      }
    } else {
      return res.status(400).send('Role Required');
    }

    let organization;
    if (req.body.organization) {
      organization = await Organization.findOne({
        _id: req.body.organization
      });
      if (!organization) {
        return res.status(400).send('Invalid Organization');
      }
    } else {
      res.status(400).send('Organization Required');
    }

    user = new User(
      pick(req.body, ['name', 'email', 'password', 'organization', 'role', 'levels', 'owner', 'created'])
    );

    const salt = await bcrypt.genSalt(10);
    
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();

    res.json({
      ...pick(user, ['_id', 'name', 'email', 'isActive']),
      organization,
      role
    });
  } catch (e) {
    res.status(503).send(e.message);
  }
});

router.put('/:id', auth, async (req, res) => {
  const { error } = () => {
    const schema = {
      email: Joi.string().email()
    };
    return Joi.validate(req.params, schema);
  };
  const { id } = req.params;

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    if (req.body.email) {
      const emailCheck = await User.findOne({ email: req.body.email });
      if (emailCheck && emailCheck._id.toString() !== id) {
        return res.status(400).send('Email already registered');
      }
    }

    let role;
    if (req.body.role) {
      role = await Role.findOne({ _id: req.body.role });
      if (!role) {
        res.status(400).send('Invalid Role');
      }
    }

    let organization;
    if (req.body.organization) {
      organization = await Organization.findOne({
        _id: req.body.organization
      });
      if (!organization) {
        res.status(400).send('Invalid Organization');
      }
    }

    const query = {
      ...pick(req.body, ['name', 'email', 'levels', 'isActive'])
    };

    if (req.body.organization) {
      query.organization = req.body.organization;
    }

    if (req.body.role) {
      query.role = req.body.role;
    }

    let user = await User.findOneAndUpdate({ _id: id }, query, { new: true });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (!role) {
      role = await Role.findOne({ _id: user.role });
    }

    if (!organization) {
      organization = await Organization.findOne({ _id: user.organization });
    }

    return res.json({
      ...pick(user, ['name', 'email', 'isActive', 'levels', 'owner', 'created', 'isActive']),
      role,
      organization
    });
  } catch (e) {
    return res.error(503).send(e.message);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    //delete all sites that are registered to the user
    const sites = await Site.find({user:req.params.id});
    if(sites) {
      sites.map(item = async(item) => {
        await Site.findByIdAndDelete({_id : item._id});
      })
    }
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res.status(400).send('User not found');
    }
    return res.send(user);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

// get the registered site( top 1)
router.get('/:id/site', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const sites = await Site.find({ owner: id })
      .populate('user')
      .populate('organization');
    if (sites){
      return res.json(sites);
    } else {
      return res.json('Site not found');
    }
  } catch (e) {
    return res.json('Site not found');
  }
});
module.exports = router;
