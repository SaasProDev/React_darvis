import { LOGGING } from '../../../config';

const INFO_STYLE = `
  color: blue;
  background: yellow;
  font-weight: bold;
  padding: 3px;
`;

const WARN_STYLE = `
  color: red;
  background: beige;
  font-weight: bold;
  border: 1px solid red;
  padding: 3px;
`;

const ERROR_STYLE = `
  color: white;
  background: red;
  font-weight: bold;
  padding: 3px;
`;

function generateTrace() {
  const stackTrace = new Error().stack.replace(/^Error\s+/, ''); // Only tested in latest FF and Chrome

  let callerName = stackTrace.split('\n')[2]; // 1st item is this, 2nd item is caller
  let callerSource = stackTrace.split('\n')[3]; // 1st item is this, 2nd item is caller

  if (callerSource) {
    callerSource = callerSource.replace(/ http.*$/, '');
  }
  if (callerName) {
    callerName = callerName.replace(/ http.*$/, '');
  }

  callerName = callerName
    ? callerName
        .replace(/ \(.+\)$/, '')
        .substring(6)
        .trim()
    : '';
  callerSource = callerSource
    ? callerSource
        .replace(/ \(.+\)$/, '')
        .substring(6)
        .trim()
    : '';

  return [callerName, callerSource];
}

const Logger = {
  info(message, ...args) {
    const [callerName, callerSource] = generateTrace();

    if (
      LOGGING.enabled &&
      (LOGGING.loglevel === 'error' || LOGGING.loglevel === 'warn' || LOGGING.loglevel === 'info')
    ) {
      if (args && args.length) {
        // eslint-disable-next-line no-console
        console.info(`%c[INFO] ${callerSource}/${callerName}`, INFO_STYLE, message, args);
      } else {
        // eslint-disable-next-line no-console
        console.info(`%c[INFO] ${callerSource}/${callerName}`, INFO_STYLE, message);
      }
    }
  },

  warn(message, ...args) {
    const [callerName, callerSource] = generateTrace();
    if (LOGGING.enabled && (LOGGING.loglevel === 'error' || LOGGING.loglevel === 'warn')) {
      if (args && args.length) {
        // eslint-disable-next-line no-console
        console.info(`%c[WARN] ${callerSource}/${callerName}`, WARN_STYLE, message, args);
      } else {
        // eslint-disable-next-line no-console
        console.info(`%c[WARN] ${callerSource}/${callerName}`, WARN_STYLE, message);
      }
    }
  },

  error(message, ...args) {
    const [callerName, callerSource] = generateTrace();
    if (LOGGING.enabled && LOGGING.loglevel === 'error') {
      if (args && args.length) {
        // eslint-disable-next-line no-console
        console.info(`%c[ERROR] ${callerSource}/${callerName}`, ERROR_STYLE, message, args);
      } else {
        // eslint-disable-next-line no-console
        console.info(`%c[ERROR] ${callerSource}/${callerName}`, ERROR_STYLE, message);
      }
    }
  },
};

export default Logger;
