const fs = require('fs');
const config = require('../config');

const getPath = () => {
  let path = '';
  if (config.mode === 'server') {
    path = config.path;
  } else if(config.mode === 'windows') {
    path = 'd:\\darvis';
  }
  return path;
}

const isFolderExists = async (path, createFolder) => {
  try {
    let p = path;
    if(await fs.existsSync(p)){
      return true;
    } else {
      if(createFolder) {
        fs.mkdirSync(p);
      }
      return false;
    }
  } catch (e) {
    return false;
  }
}

exports.getMainPath = () => {
  return getPath();
}

exports.checkFolderExists = async (path, createFolder) => {
  return await isFolderExists(path, createFolder);
}

exports.saveDW = async (filename, dw) => {
  let path = getPath();
  await isFolderExists(path, true);
  path = path + '/dw';
  await isFolderExists(path, true);
  fs.writeFile(path + '/' + filename, JSON.stringify(dw, null, 2), function (err) {
    if (err) {
      //console.log(err);
      //return false;
    }
  });
  return true;
}

exports.deleteFile = async(path) => {
  try {
    fs.unlinkSync(path);
  } catch(err) {
    console.log(err);
  }
}

// copy image file to the main directory
exports.copyLevelFile = async (origin, fileName) => {
  let path = getPath();
  // check directory exists and create it
  await isFolderExists(path, true);
  path = path + '/levels';
  await isFolderExists(path, true);
  fileName = fileName.replace('/uploads', '');
  fileName = fileName.replace('\\uploads', '');
  path = path + '/' + fileName;
  fs.copyFile(origin, path, (err) => {
    if (err) {
      console.log(err);
    }
  });

}

