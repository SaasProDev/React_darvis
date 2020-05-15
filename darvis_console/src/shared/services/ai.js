import API from '../../api';
import { AI } from '../../api/endpoints';

export async function getAI() {
  const api = new API();
  return api.get(AI).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}

export async function getAIById(id) {
  const api = new API();
  return api.get(AI, id).then(
    res => res.data,
    error => {
      throw error;
    }
  );
}
