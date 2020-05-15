const uuidv1 = require('uuid/v1');
const canvas = require('canvas');
const config = require('../config');
const { deleteFile, getMainPath } = require('./fileUtils');

function getLowerSiteName(siteName) {
  return siteName.replace(' ', '').toLowerCase();
}

function getImageDimensions(file) {
  var i = new canvas.Image;
  i.src = 'data:image/png;base64,' + file;
  return { w: i.width, h: i.height };
}

exports.getDataWorldJson = function (site) {
  let triggers = [];
  site.dwInfo.objects[3].triggers.map(item => {
    let trigger = {};
    trigger.id = item._id
    trigger.name = item.name;
    trigger.condition = item.condition;
    var action = {};
    if (item.action && item.action.type) {
      action.type = item.action.type;
      action.receipient = item.action.receipient;
      if (action.type === 'publish' || action.type === 'json') {
        var body = {};
        item.action.fields.map(f => {
          body[f.name] = f.value;
        });
        action.body = body;
      } else if (action.type === 'text' || action.type === 'email') {
        action.body = item.action.body
      }
    }
    trigger.action = action;
    triggers.push(trigger);
  });

  let kpis = [];
  site.dwInfo.objects[2].kpis.map(item => {
    let kpi = {
      name: item.name,
      kpiType: item.type,
      intervalSeconds: item.interval,
      classField: 'rawcameradata.class',
      classes: [item.object]
    };
    kpis.push(kpi);
  });

  let cameras = [];
  site.cameras.map(item => {
    const cam = {
      cameraId: item._id,
      cameraEnabled: item.isActive,
      displayName: item.name,
      url: item.url,
      user: item.user,
      pass: item.pass,
      homography: item.homography ? [
        item.homography.a,item.homography.b,item.homography.c,item.homography.d,item.homography.e,item.homography.f,item.homography.g,item.homography.h,item.homography.i
      ] : [0,0,0,0,0,0,0,0,1],
      src_points: item.cameraPoints ? {
        p1x: item.cameraPoints.p1.x,
        p1y: item.cameraPoints.p1.y,
        p2x: item.cameraPoints.p2.x,
        p2y: item.cameraPoints.p2.y,
        p3x: item.cameraPoints.p3.x,
        p3y: item.cameraPoints.p3.y,
        p4x: item.cameraPoints.p4.x,
        p4y: item.cameraPoints.p4.y
      } : {},
      dst_points: item.floorPlanPoints ? {
        p1x: item.floorPlanPoints.p1.x,
        p1y: item.floorPlanPoints.p1.y,
        p2x: item.floorPlanPoints.p2.x,
        p2y: item.floorPlanPoints.p2.y,
        p3x: item.floorPlanPoints.p3.x,
        p3y: item.floorPlanPoints.p3.y,
        p4x: item.floorPlanPoints.p4.x,
        p4y: item.floorPlanPoints.p4.y
      } : {},
      frame_width: item.cam_res_x,
      frame_height: item.cam_res_y,
      frames_per_second: 60,
    }
    cameras.push(cam);
  });

  lowerSiteName = site.dwInfo.name;
  let aiClasses = [];
  site.ai.classes.map(item => {
    aiClasses.push(item.className);
  });
  return {
    clientId: site.dwInfo._id,
    schemaVersion: site.dwInfo.version,
    revision: site.dwInfo.revision,
    createdOn: site.created,
    lastUpdatedOn: new Date(),
    siteName: lowerSiteName,
    sitePlanUrl: 'Floorplan url',
    inputs: [
      {
        inputType: 'camera',
        tableName: 'rawcameradata',
        payloadFormat: 'json',
        ai: {
          version: site.ai.version,
          classes: aiClasses
        },
        inputSchema: [
          {
            name: 'camera_id',
            type: 'string'
          },
          {
            name: 'frame_timestamp',
            type: 'string'
          },
          {
            name: 'class',
            type: 'string'
          },
          {
            name: 'top',
            type: 'int'
          },
          {
            name: 'left',
            type: 'int'
          },
          {
            name: 'bottom',
            type: 'int'
          },
          {
            name: 'right',
            type: 'int'
          },
          {
            name: 'frame_id',
            type: 'string'
          },
          {
            name: 'confidence',
            type: 'float'
          }
        ],
        sensors: cameras,
      }
    ],
    outputs: [
      {
        outputId: site.dwInfo.objects[1].objectId,
        outputType: site.dwInfo.objects[1].objType,
        displayName: 'beds',
        outputSchema: [
          {
            src: "rawcameradata.camera_id",
            dst: "camera_id"
          },
          {
            src: "CONFIG_LOOKUP(rawcameradata.camera_id, inputs.sensors.cameraId, inputs.sensors.displayName)",
            dst: "camera_name"
          },
          {
            src: "rawcameradata.frame_timestamp",
            dst: "timestamp"
          },
          {
            src: "rawcameradata.class",
            dst: "class"
          },
          {
            src: "homography.loc_x",
            dst: "loc_x"
          },
          {
            src: "homography.loc_y",
            dst: "loc_y"
          },
          {
            src: "rawcameradata.frame_id",
            dst: "frame_id"
          },
          {
            src: "rawcameradata.confidence",
            dst: "confidence"
          }
        ]
      },
      {
        outputid: site.dwInfo.objects[2].objectId,
        outputType: site.dwInfo.objects[2].objType,
        kpis: kpis,
        triggers: site.dwInfo.objects[3].triggers
      }
    ],
    translators: [
      {
        transType: 'HOMOGRAPHY',
        input: [
          {
            "translator": "top",
            "source": "rawcameradata.top"
          },
          {
            "translator": "left",
            "source": "rawcameradata.left"
          },
          {
            "translator": "bottom",
            "source": "rawcameradata.bottom"
          },
          {
            "translator": "right",
            "source": "rawcameradata.right"
          }
        ],
        outputName: 'homography',
        output: [
          {
            "translator": "loc_x",
            "object": "loc_x"
          },
          {
            "translator": "loc_y",
            "object": "loc_y"
          }
        ]
      }
    ],
  }
};

exports.generateDataWorld = function (site) {
  return ({
    _id: uuidv1(),
    name: getLowerSiteName(site.name),
    version: 3,
    revision: 5,
    dwType: 'darvis',
    darvisType: 'healthcare',
    createdOn: Date.now,
    viewers: [],
    objects: [
      {
        objectId: uuidv1(),
        objType: 'building',
      },
      {
        objectId: uuidv1(),
        objectType: 'datapoint',
      },
      {
        objectId: uuidv1(),
        objType: 'kpi',
        kpis: [],
      },
      {
        objectId: uuidv1(),
        objType: 'trigger',
        triggers: [],
      }
    ],
    lookups: [],
    localTimezone: 'CET'
  });
}

// leve functionalities
exports.addLevelToSite = function (name, vtype, plan, site) {
  // update db after completing this call
  return new Promise((resolve, reject) => {
    if (site) {
      const allLevels = site.levels;
      const level = {
        _id: uuidv1(),
        name,
        scale: 0.0023,
        plan,
        vtype,
        serviceHours: 'mon-fri/6-19',
        zones: []
      };
      allLevels.push(level);
      resolve(site);
    } else {
      reject('Site cant be null');
    }
  });
};
exports.updateLevel = function (level, plan, site) {
  // update db after completing this call
  return new Promise((resolve, reject) => {
    if (site) {
      const selectedLevel = site.levels.find(x => x.id == level._id);
      if (selectedLevel != null) {
        selectedLevel.name = level.name;
        if (plan != "")
          selectedLevel.plan = plan;
      }
      resolve(site);
    } else {
      reject('Site cant be null');
    }
  });
};
exports.deleteLevelFromSite = function (site, levelId) {
  return new Promise((resolve, reject) => {
    if (site && levelId) {
      const levels = site.levels;
      const index = levels.findIndex(x => x._id === levelId);
      const level = levels[index];
      const levelFileName = level.plan.replace('\\uploads\\', '');
      site.levels.splice(index, 1);
      // remove image;
      const path = getMainPath();
      deleteFile(path + '/levels/' + levelFileName);
      deleteFile('./public/uploads/' + levelFileName);
      resolve(site);
    } else {
      reject('error');
    }
  });
};

// zone functionalities
exports.addZoneToLevel = function (site, zone) {
  return new Promise((resolve, reject) => {
    if (site) {
      const selectedLevel = site.levels.find(x => x._id == zone.levelId);

      if (selectedLevel != null) {
        const newZone = {
          _id: uuidv1(),
          name: zone.name,
          points: zone.points
        };

        selectedLevel.zones.push(newZone);
      } else {
        reject('Can not find the proper level');
      }

      resolve(site);
    } else {
      reject('Site cant be null');
    }
  });
};
exports.updateZone = function (site, zone) {
  return new Promise((resolve, reject) => {
    if (site) {
      const selectedLevel = site.levels.find(x => x._id == zone.levelId);

      if (selectedLevel != null) {
        const oldZone = selectedLevel.zones.find(x => x._id == zone._id);
        oldZone.name = zone.name;
        oldZone.points = zone.points
      } else {
        reject('Can not find the proper level');
      }

      resolve(site);
    } else {
      reject('Site cant be null');
    }
  });
};
exports.deleteZone = function (site, zoneId, levelId) {
  return new Promise((resolve, reject) => {
    if (site && zoneId) {

      const level = site.levels.find(x => x._id === levelId);
      const zone = level.zones.findIndex(x => x._id === zoneId);
      level.zones.splice(zone, 1);

      resolve(site);
    } else {
      reject("Something is null");
    }
  });
};

// AI functionalities
exports.addAI = function (site, ai) {
  return new Promise((resolve, reject) => {
    if (site) {
      const aiData = {
        _id: uuidv1(),
        type: ai.type,
        version: ai.version,
        containerURL: ai.containerURL,
        classes: ai.classes
      }
      site.ai.push(aiData);
      resolve(site);
    } else {
      reject('Site cant be null');
    }
  });
};
// AI data functionalites
exports.addAIData = function (site, data) {
  return new Promise((resolve, reject) => {
    if (site) {
      if (data && data.length > 0) {
        data.map(item => {
          site.data.push(item);
        })
      }
      resolve(site);
    } else {
      reject('Site cant be null');
    }
  });
};

exports.addCamera = function (site, camera, cameraPoints, floorPlanPoints) {
  const fs = require('fs');
  const fileName = `${Date.now()}-${camera.name}.png`;
  const filePath = './public/uploads/' + fileName;
  try {
    const resolution = getImageDimensions(camera.image);
    if (resolution) {
      camera.cam_res_x = resolution.w;
      camera.cam_res_y = resolution.h;
    }
    fs.writeFile(filePath, camera.image, { encoding: 'base64' }, function (err) {
      if (err) {
        camera.image = '';
      } else {
        camera.image = '/uploads/' + fileName;
      }
    });
    camera.image = '/uploads/' + fileName;

  } catch (e) {
    console.log(e);
  }

  return new Promise((resolve, reject) => {
    if (site && camera /*&& cameraPoints && floorPlanPoints*/) {
      camera.homography = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0,
        g: 0,
        h: 0,
        i: 1
      };
      camera.cameraPoints = cameraPoints;
      camera.floorPlanPoints = floorPlanPoints;
      camera.isActive = true;
      site.cameras.push(camera);
      resolve(site);
    } else {
      reject('Something is null');
    }
  });
};

exports.enableCamera = function (site, cameraId) {
  return new Promise((resolve, reject) => {
    if (site && cameraId) {
      const selectedCamera = site.cameras.find(x => x._id === cameraId);
      selectedCamera.isActive = !selectedCamera.isActive;
      resolve(site);
    } else {
      reject('Something is null');
    }
  })
}

exports.updateCamera = function (site, camera, cameraPoints, floorPlanPoints, homography) {
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    if (site && camera && camera._id) {
      if (floorPlanPoints) {
        camera.floorPlanPoints = floorPlanPoints;
      } else {
        camera.floorPlanPoints = {};
      }
      if (cameraPoints) {
        camera.cameraPoints = cameraPoints;
      } else {
        camera.cameraPoints = {};
      }
      if (homography) {
        camera.homography = homography;
      } else {
        camera.homography = {
          a: 0,
          b: 0,
          c: 0,
          d: 0,
          e: 0,
          f: 0,
          g: 0,
          h: 0,
          i: 1
        };
      }
      const selectedCamera = site.cameras.find(x => x._id === camera._id);

      selectedCamera.name = camera.name;
      selectedCamera.url = camera.url;

      // check camera image is changed
      if (!camera.image.startsWith('/uploads')) {
        // image is changed
        const resolution = getImageDimensions(camera.image);
        if (resolution) {
          selectedCamera.cam_res_x = resolution.w;
          selectedCamera.cam_res_y = resolution.h;
        }
        try {
          fs.writeFile('./public' + selectedCamera.image, camera.image, { encoding: 'base64' }, function (err) {
            if (err) {
              selectedCamera.image = '';
              console.log('error');
            } else {

            }
          });
        } catch (e) {
          console.log(e);
        }
      }
      //selectedCamera.image = camera.image;
      selectedCamera.type = camera.type;
      selectedCamera.user = camera.user;
      selectedCamera.pass = camera.pass;
      selectedCamera.levelId = camera.levelId;
      selectedCamera.homography = camera.homography;
      selectedCamera.cameraPoints = cameraPoints;
      selectedCamera.floorPlanPoints = floorPlanPoints;
      resolve(site);
    } else {
      reject('Something is null');
    }
  });
};

exports.deleteCamera = function (site, cameraId) {
  return new Promise((resolve, reject) => {
    if (site && cameraId) {
      const cameraIndex = site.cameras.findIndex(x => x._id === cameraId);
      const filePath = site.cameras[cameraIndex].image;
      site.cameras.splice(cameraIndex, 1);
      deleteFile('./public' + filePath);

      resolve(site);
    } else {
      reject('Something is null');
    }
  });
};

exports.addKPIs = function (site, kpis) {
  return new Promise((resolve, reject) => {
    if (site) {
      kpis.forEach(item => {
        let k = item;
        k = {
          _id: uuidv1(),
          ...k
        }
        site.dwInfo.objects[2].kpis.push(k);
      });
      resolve(site);
    } else {
      reject('Site not found');
    }
  });
}

// kpi functionalities
exports.addKPI = function (site, kpi) {
  return new Promise((resolve, reject) => {
    if (site) {
      let k = kpi;
      k = {
        _id: uuidv1(),
        ...k
      }
      site.dwInfo.objects[2].kpis.push(k);
      resolve(site);
    } else {
      reject('Site not found');
    }
  });
};
exports.updateKPI = function (site, kpi) {
  return new Promise((resolve, reject) => {
    if (site) {
      const k = site.dwInfo.objects[2].kpis.find(x => x._id === kpi._id);
      k.name = kpi.name;
      k.interval = kpi.interval;
      k.type = kpi.type;
      k.object = kpi.object;
      if (kpi.attribute) {
        k.attribute = kpi.attribute;
      } else if (k.attribute) {
        delete k.attribute;
      }
      if (kpi.state) {
        k.state = kpi.state;
      } else if (k.state) {
        delete k.state;
      }
      if (kpi.where) {
        k.where = kpi.where;
      } else if (k.where) {
        delete k.where;
      }
      if (kpi.events) {
        k.events = kpi.events;
      } else if (k.events) {
        delete k.events;
      }
      resolve(site);
    } else {
      reject('Site not found');
    }
  });
};
exports.deleteKPI = function (site, kpiId) {
  return new Promise((resolve, reject) => {
    if (site && kpiId) {
      const kpis = site.dwInfo.objects[2].kpis;
      const kpiIndex = kpis.findIndex(x => x._id == kpiId);
      kpis.splice(kpiIndex, 1);

      resolve(site);
    } else {
      reject('Something is null');
    }
  });
};

// trigger functionalities
exports.addTrigger = function (site, trigger) {
  return new Promise((resolve, reject) => {
    if (site) {
      site.dwInfo.objects[3].triggers.push(trigger);
      resolve(site);
    } else {
      reject('Site not found');
    }
  });
};
exports.updateTrigger = function (site, trigger) {
  return new Promise((resolve, reject) => {
    if (site) {
      const t = site.dwInfo.objects[3].triggers.find(x => x._id === trigger._id);
      t.name = trigger.name;
      t.condition = trigger.condition;
      t.action = trigger.action ? trigger.action : {};
      resolve(site);
    } else {
      reject('Site not found');
    }
  });
};
exports.deleteTrigger = function (site, triggerId) {
  return new Promise((resolve, reject) => {
    if (site && triggerId) {
      const triggers = site.dwInfo.objects[3].triggers;
      const triggerIndex = triggers.findIndex(x => x._id == triggerId);
      triggers.splice(triggerIndex, 1);

      resolve(site);
    } else {
      reject('Something is null');
    }
  });
};

exports.generateAI = function () {
  return ({
    _id: uuidv1(),
    type: 'healthcare',
    version: 2.2,
    containerURL: null,
    classes: [
      {
        "classId": 1,
        "className": "cleaned_bed",
        "attributes": [],
        "states": [
          "fixed",
          "moving"
        ]
      },
      {
        "classId": 2,
        "className": "uncleaned_bed",
        "attributes": [],
        "states": [
          "fixed",
          "moving"
        ]
      },
      {
        "classId": 3,
        "className": "occupied_bed",
        "attributes": [],
        "states": [
          "fixed",
          "moving"
        ]
      },
      {
        "classId": 2,
        "className": "person",
        "attributes": [],
        "states": [
          "fixed",
          "moving"
        ]
      }
    ]
  });
}
exports.generateAIData = function () {
  return ([
    {
      src: "object_id",
      dst: "object_id",
      "use": true,
      "fieldType": "string"
    },
    {
      src: "camera_id",
      dst: "camera_id",
      "use": true,
      "fieldType": "string"
    },
    {
      src: "camera_name",
      dst: "camera_name",
      "use": true,
      "fieldType": "string"
    },
    {
      src: "timestamp",
      dst: "timestamp",
      "use": true,
      "fieldType": "string"
    },
    {
      src: "object_type",
      dst: "object_type",
      "use": true,
      "fieldType": "string"
    },
    {
      src: "loc_x",
      dst: "loc_x",
      "use": true,
      "fieldType": "float"
    },
    {
      src: "loc_y",
      dst: "loc_y",
      "use": true,
      "fieldType": "float"
    }
  ]);
}