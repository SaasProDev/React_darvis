import API from '../../api';
import { ROLE } from '../../api/endpoints';

export const ROLES = {
  ADMIN: 'sadmin',
  OWNER: 'owner',
  MANAGER: 'manager',
  EDITOR: 'editor',
  VIEWER: 'viewer',
  MOBILEUSER: 'muser',
  GOD: 'god',
};

export function readRoleFromStorage() {
  let user = localStorage.getItem('user') || {};
  if (user) {
    user = JSON.parse(user);
  }
  const role = user.role || {};

  return role.key;
}

export const isAdmin = () => readRoleFromStorage() === ROLES.ADMIN;
export const isOwner = () => readRoleFromStorage() === ROLES.OWNER;
export const isManager = () => readRoleFromStorage() === ROLES.MANAGER;
export const isEditor = () => readRoleFromStorage() === ROLES.EDITOR;
export const isViewer = () => readRoleFromStorage() === ROLES.VIEWER;
export const isMobileUser = () => readRoleFromStorage() === ROLES.MOBILEUSER;
export const isGod = () => readRoleFromStorage() === ROLES.GOD;



export async function getRoles() {
  const api = new API();
  return api.get(ROLE).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function getRole(id) {
  const api = new API();
  return api.get(ROLE, id).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function addRole(course) {
  const api = new API();
  return api.post(ROLE, course).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function updateRole(course, id) {
  const api = new API();
  return api.put(`${ROLE}/${id}`, course).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function deleteRole(id) {
  const api = new API();
  return api.delete(ROLE, id).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}
