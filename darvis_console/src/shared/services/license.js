import API from '../../api';
import { LICENSE } from '../../api/endpoints';

export async function getLicenses() {
  const api = new API();
  return api.get(LICENSE).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function getLicense(id) {
  const api = new API();
  return api.get(LICENSE, id).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function addLicense(course) {
  const api = new API();
  return api.post(LICENSE, course).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function updateLicense(course, id) {
  const api = new API();
  return api.put(`${LICENSE}/${id}`, course).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function deleteLicense(id) {
  const api = new API();
  return api.delete(LICENSE, id).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}


export async function checkLicense(key) {
  const api = new API();
  return api.post(`${LICENSE}/validate`, key).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}