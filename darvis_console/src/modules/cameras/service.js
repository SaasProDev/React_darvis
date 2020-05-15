import axios from 'axios';
import {CAMERA_API} from '../../config'

export const connectCamera = async camera => {
  try {
    console.log(camera);
    const res = await axios.post(CAMERA_API, {
      url: camera.url,
      username: camera.user,
      password: camera.pass,
    });
    return res.data;
  } catch (err) {
    return 'error';
  }
};

export const fetcHomography = () => {
  return new Promise(resolve => {
    resolve('123');
  });
};
