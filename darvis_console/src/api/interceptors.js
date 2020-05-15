import { get } from 'lodash-es';
import errorObject from './errorObject';

export const errorResponseHandler = error => {
  let { message } = error;
  if (
    error &&
    (get(error, 'status') === 401 || get(error, 'status') === 403 || get(error, 'response.status') === 403)
  ) {
    message = "You're UnAuthorized, check login or user privileges";
  }

  if (error && (get(error, 'status') === 404 || get(error, 'response.status') === 404)) {
    message = 'Not Found';
  }

  if (error && (get(error, 'status') === 503 || get(error, 'response.status')) === 503) {
    message = 'Internal Server Error';
  }

  if (error) {
    error.message = message;
    throw errorObject(error);
  }
};

export function successResponseHandler(response) {
  return {
    ...response,
  };
}
