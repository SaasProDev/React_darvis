import API from '../../api';
import { CAMERA } from '../../api/endpoints';

export async function getCameras() {
  const api = new API();
  return api.get(CAMERA).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function getCamera(id) {
  const api = new API();
  return api.get(CAMERA, id).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}
