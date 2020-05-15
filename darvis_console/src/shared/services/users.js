import API from '../../api';
import { USERS } from '../../api/endpoints';

export async function getUsers() {
  const api = new API();
  return api.get(USERS).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}



export async function getUsersByOwner(ownerId) {
  const api = new API();
  return api.get(`${USERS}/byOwner`, ownerId).then(
    res => res.data,
    error => {
      throw error;
    }
  )
}

export async function getUser(id) {
  const api = new API();
  return api.get(USERS, id).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function addUser(user) {
  const api = new API();
  return api.post(USERS, user).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function updateUser(user, id) {
  const api = new API();
  return api.put(`${USERS}/${id}`, user).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function deleteUser(id) {
  const api = new API();
  return api.delete(USERS, id).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}
