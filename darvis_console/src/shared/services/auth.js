import API from '../../api';
import { AUTH } from '../../api/endpoints';

export async function authenticate({ email, password }) {
  try {
    const api = new API();
    return api.post(AUTH, { email, password }).then(
      res => res,
      error => {
        throw error;
      }
    );
  } catch {
    return 'error';
  }
}

export async function findMe() {
  const api = new API();
  return api.get(`${AUTH}/me`).then(
    res => res,
    error => {
      throw error;
    }
  );
}
