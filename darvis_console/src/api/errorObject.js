import { get } from 'lodash-es';

const errorObject = error => {
  let errorResponse;
  let errorCode;
  let { message } = error;

  if (error.response && error.response.data) {
    errorResponse = error.response.data;
    if (errorResponse.code) {
      errorCode = errorResponse.code;
    }

    if (errorResponse.errors && errorResponse.errors.length) {
      const { title, description } = errorResponse.errors[0];
      message = `${title}: ${description}`;
    }
  }

  return {
    data: errorResponse && errorResponse.errors ? errorResponse.errors : errorResponse,
    error,
    fail: true,
    message,
    statusCode: error.code || errorCode || get(error, 'response.status'),
  };
};

export default errorObject;
