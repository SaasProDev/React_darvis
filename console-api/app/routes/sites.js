const express = require('express');
const { pick } = require('lodash');
const fs = require('fs');
const bcrypt = require('bcrypt');
const router = express.Router();

const AI = require('../models/ai.model');
const Site = require('../models/site.modal');
const Role = require('../models/role.model');
const Organization = require('../models/organization.model');
const License = require('../models/license.model');
const { User } = require('../models/user.model');
const { auth } = require('../middleware/auth');
const { generateKey } = require('../utils');
const {
  generateDataWorld,
  getDataWorldJson,
  addLevelToSite,
  updateLevel,
  deleteLevelFromSite,
  addZoneToLevel,
  updateZone,
  deleteZone,
  addCamera,
  updateCamera,
  enableCamera,
  deleteCamera,
  addKPIs,
  addKPI,
  updateKPI,
  deleteKPI,
  addTrigger,
  updateTrigger,
  deleteTrigger,
  addAI,
  addAIData,
  generateAI,
  generateAIData
} = require('../siteUtils');
const upload = require('../fileUploads');
const { checkFolderExists, saveDW, deleteFile, getMainPath, copyLevelFile } = require('../fileUtils');

const addOneYear = () => {
  const date = new Date();

  const y = date.getFullYear();
  const d = date.getDate();
  const m = date.getMonth();

  return new Date(y + 1, m, d);
};

// return all sites
// this function looks like no need.
router.get('/', auth, async (req, res) => {
  try {
    const sites = await Site.find({})
      .populate('user')
      .populate('organization');

    return res.json(sites);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

// return site by id
// this function looks like no need.
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const site = await Site.findOne({ _id: id })
      .populate('owner')

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});
router.get('/dataworldjson/:siteid', auth, async (req, res) => {
  const { siteid } = req.params;

  try {
    const site = await Site.findOne({ _id: siteid });
    const dataworldJson = getDataWorldJson(site);
    let r = await saveDW(site.dwInfo.name + '.json', dataworldJson);
    if (!r) {
      return res.status(503).send('Failed on saving DW');
    }
    return res.json(dataworldJson);
  } catch (e) {
    console.log(e);
    return res.status(503).send('Failed on saving DW');
  }
});
router.get('/restartAI/:siteid', auth, async (req, res) => {
  const shell = require('shelljs');
  const { siteid } = req.params;

  try {
    const site = await Site.findOne({ _id: siteid });
    const ai = await AI.find({});
    const dataworldJson = getDataWorldJson(site);

    if (await saveDW(site.dwInfo.name + '.json', dataworldJson)) {
      if (config.mode === 'server') {
        shell.exec(config.restart_ai);
      }
    } else {
      return res.status(503).send('Failed on saving DW');
    }
    return res.json(dataworldJson);
  } catch (e) {
    return res.json('failed');
  }
});
// update site name
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    let site = await Site.findOneAndUpdate({ _id: id }, pick(req.body, ['name']));

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});


// level api
// add, update, delete
// working fine
router.post('/:id/addLevel', auth, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    const { file, body } = req;
    if (file) {
      let filePath = file.path.split('public')[1];
      await copyLevelFile(file.path, filePath);
      let updatedSite = await addLevelToSite(body.name, body.vtype, filePath, site);
      site = await Site.findOneAndUpdate({ _id: id }, updatedSite);
    }
    if (!site) {
      return res.status(404).send('Site not found');
    }
    return res.json(site);
  } catch (e) {
    console.log(e);
    return res.status(503).send(e.message);
  }
});
router.put('/:id/updateLevel', auth, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    const { file, body } = req;
    let filePath = "";
    if (file) {
      filePath = file.path.split('public')[1];
      // delete and upload new file
      const level = site.levels.find(x => x._id === body.levelId);
      const oldPath = getMainPath();
      let oldFile = level.plan;
      oldFile = oldFile.replace('\\uploads\\', '');
      oldFile = oldFile.replace('/uploads/', '');
      await deleteFile(oldPath + '/levels/' + oldFile);
      await deleteFile('./public/uploads/' + oldFile)
      await copyLevelFile(file.path, filePath);
    }

    // update site
    let updatedSite = await updateLevel(body, filePath, site);
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    console.log(e);
    return res.status(503).send(e.message);
  }
});
router.delete('/:id/deleteLevel/:levelId', auth, async (req, res) => {
  const { id, levelId } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    let updatedSite = await deleteLevelFromSite(site, levelId);
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);
    if (!site) {
      return res.status(404).send('Site not found');
    }
    return res.json(site);
  } catch (e) {
    console.log(e);
    return res.status(503).send(e.message);
  }
});

// zone api
// add, update, delete
// working fine
router.post('/:id/addZone', auth, async (req, res) => {
  const { id } = req.params;

  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;

    let updatedSite = await addZoneToLevel(site, body);

    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});
router.put('/:id/updateZone', auth, async (req, res) => {
  const { id } = req.params;

  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;

    let updatedSite = await updateZone(site, body);

    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});
router.delete('/:id/deleteZone/:zoneId/:levelId', auth, async (req, res) => {
  const { id, zoneId, levelId } = req.params;

  try {
    let site = await Site.findOne({ _id: id });
    let updatedSite = await deleteZone(site, zoneId, levelId);
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);
    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    console.log(e);
    return res.status(503).send(e.message);
  }
});


// ai api
// add
router.post('/:id/addAI', async(req, res) => {
  const { id } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;

    let updatedSite = await addAI(site, body);

    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

// ai_data api
// add
router.post('/:id/addAIData', async(req, res) => {
  const { id } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;

    let updatedSite = await addAIData(site, body);

    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

// camera api
router.post('/:id/addCamera', auth, async (req, res) => {
  const { id } = req.params;

  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;

    let updatedSite = await addCamera(
      site,
      body.camera,
      body.cameraPoints,
      body.floorPlanPoints
    );

    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.put('/:id/updateCamera', auth, async (req, res) => {
  const { id } = req.params;

  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;
    let updatedSite = await updateCamera(
      site,
      body.camera,
      body.cameraPoints,
      body.floorPlanPoints,
      body.homography,
    );
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.put('/:id/enableCamera', auth, async (req, res) => {
  const { id } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;
    let updatedSite = await enableCamera(
      site,
      body.cameraId,
    );
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.delete('/:id/deleteCamera/:cameraId', auth, async (req, res) => {
  const { id, cameraId } = req.params;

  try {
    let site = await Site.findOne({ _id: id });
    let updatedSite = await deleteCamera(site, cameraId);
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.post('/:id/addKPIs', auth, async(req, res) => {
  const {id} = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;
    let updatedSite = await addKPIs(
      site,
      body.kpis,
    );
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite, {new: true});
    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    console.log(e);
    return res.status(503).send(e.message);
  }
});

// kpi api
router.post('/:id/addKPI', auth, async (req, res) => {
  const { id } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;
    let updatedSite = await addKPI(
      site,
      body.kpi,
    );
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite, {new: true});
    
    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});
router.put('/:id/updateKPI', auth, async (req, res) => {
  const { id } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;
    let updatedSite = await updateKPI(site, body.kpi);

    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }
    return res.json(site);
  } catch (e) {
    console.log(e);
    return res.status(503).send(e.message);
  }
});
router.delete('/:id/deleteKPI/:kpiId', auth, async (req, res) => {
  const { id, kpiId } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    let updatedSite = await deleteKPI(site, kpiId);
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

// trigger api
router.post('/:id/addTrigger', auth, async (req, res) => {
  const { id } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;
    let updatedSite = await addTrigger(site, body.trigger);
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }

    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});
router.put('/:id/updateTrigger', auth, async (req, res) => {
  const { id } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    const { body } = req;
    let updatedSite = await updateTrigger(site, body.trigger);
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);

    if (!site) {
      return res.status(404).send('Site not found');
    }
    return res.json(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});
router.delete('/:id/deleteTrigger/:triggerId', auth, async (req, res) => {
  const { id, triggerId } = req.params;
  try {
    let site = await Site.findOne({ _id: id });
    let updatedSite = await deleteTrigger(site, triggerId);
    site = await Site.findOneAndUpdate({ _id: id }, updatedSite);
    if (!site) {
      return res.status(404).send('Site not found');
    }
    return res.json(site);
  } catch (e) {

  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const site = await Site.findByIdAndDelete(req.params.id);
    if (!site) {
      return res.status(400).send('Site not found');
    }
    return res.send(site);
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

router.post('/registerPrem', async (req, res) => {
  try {
    const { body } = req;
    const owner = await Role.findOne({ key: 'owner' });
    if (!owner) {
      return res.json('no_owner');
    }
    let user = new User();
    user.name = 'owner';
    user.email = body.email;
    user.organization = body.org;
    user.role = owner._id;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(body.password, salt);

    user = await user.save();

    // create site
    let site = new Site(pick(req.body, ['name']));
    site.owner = user._id;
    site.levels = [];
    site.cameras = [];
    site.dwInfo = await generateDataWorld(site);
    site.ai = await generateAI();
    site.data = await generateAIData();
    site = await site.save();
    if (!site) {
      return res.json('failed');
    }
    // save to local directory
    var dataworldJson = getDataWorldJson(site);
    await saveDW(site.dwInfo.name + '.json', dataworldJson);
    // get organization
    const org = await Organization.findOne({ _id: user.organization });

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        owner: user.owner,
        levels: user.levels,
        token: user.generateAuthToken(),
        role: owner,
        organization: org
      },
      site: site
    });
  } catch (e) {
    console.log(e);
    return res.status(503).send(e.message);
  }
});

router.post('/isRegistered', async (req, res) => {
  let path = getMainPath() + '/dw';
  const v = await checkFolderExists(path, false);
  if (v === true) {
    // folder exists
    let dir = await fs.readdirSync(path + '/');
    const files = dir.filter(elm => elm.match(new RegExp(`.*\.(.json)`, 'ig')));
    if (files.length > 0) {
      return res.json('yes');
    } else {
      return res.json('no');
    }
  } else {
    return res.json('no');
  }
});

router.post('/initialize', async (req, res) => {
  try {
    // create license
    //return res.json('great');
    let license = await License.find();
    if (license.length === 0) {
      license = new License();
      license.name = 'Darvis_license';
      license.allowedUsers = 1;
      license.licenseKey = generateKey(7);
      license.isActive = true;
      license.salt = await bcrypt.genSalt(10);
      license.hash = await bcrypt.hash(license.licenseKey, license.salt);
      license.expiry = addOneYear();
      license = await license.save();
    } else {
      license = license[0];
    }

    // create organization
    let organization = await Organization.find({});
    if (organization.length == 0) {
      organization = new Organization();
      organization.name = 'Darvis';
      organization.site = 'darvis.com';
      organization.license = license;
      organization = await organization.save();
    } else {
      organization = organization[0];
    }
    // create role
    let admin = await Role.findOne({ key: 'sadmin' });
    if (!admin) {
      admin = new Role();
      admin.name = 'super-admin';
      admin.key = 'sadmin';
      admin = await admin.save();
    } 
    let owner = await Role.findOne({ key: 'owner' });
    if (!owner) {
      owner = new Role();
      owner.name = 'owner';
      owner.key = 'owner';
      owner = await owner.save();
    }
    let manager = await Role.findOne({ key: 'manager' });
    if (!manager) {
      manager = new Role();
      manager.name = 'admin';
      manager.key = 'manager';
      manager = await manager.save();
    }
    let editor = await Role.findOne({ key: 'editor' });
    if (!editor) {
      editor = new Role();
      editor.name = 'user';
      editor.key = 'editor';
      editor = await editor.save();
    }
    let viewer = await Role.findOne({ key: 'viewer' });
    if (!viewer) {
      viewer = new Role();
      viewer.name = 'viewer';
      viewer.key = 'viewer';
      viewer = await viewer.save();
    }
    let muser = await Role.findOne({ key: 'muser' });
    if (!muser) {
      muser = new Role();
      muser.name = 'mobile-user';
      muser.key = 'muser';
      muser = await muser.save();
    }

    // create super admin
    let superAdmin = await User.findOne({ role: admin._id });
    if (!superAdmin) {
      superAdmin = new User();
      superAdmin.name = 'superAdmin';
      superAdmin.isActive = true;
      superAdmin.email = 'admin@darvis.com';
      superAdmin.role = admin;
      superAdmin.organization = organization;

      const salt = await bcrypt.genSalt(10);
      superAdmin.password = await bcrypt.hash('mypass', salt);

      superAdmin = await superAdmin.save();
    }
    return res.json('success');
  } catch (e) {
    return res.status(503).send(e.message);
  }
});

module.exports = router;
