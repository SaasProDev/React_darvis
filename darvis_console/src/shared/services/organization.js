import API from '../../api';
import { ORGANIZATION } from '../../api/endpoints';

export async function getOrganizations() {
  const api = new API();
  return api.get(ORGANIZATION).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function getOrganization(id) {
  const api = new API();
  return api.get(ORGANIZATION, id).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function addOrganization(org) {
  const api = new API();
  return api.post(ORGANIZATION, org).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function updateOrganization(org, id) {
  const api = new API();
  return api.put(`${ORGANIZATION}/${id}`, org).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function deleteOrganization(id) {
  const api = new API();
  return api.delete(ORGANIZATION, id).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function getOrganizationByLi(license) {
  const api = new API();
  return api.get(`${ORGANIZATION}/bylicense/${license}`).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}