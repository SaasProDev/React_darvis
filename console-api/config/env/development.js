/**
 * Expose
 */

module.exports = {
  db:
    process.env.MONGODB_URL ||
    'mongodb://darvis:darvis123@ds351987.mlab.com:51987/darvis',
  mode: 'server',
  path: '/home/darvis',
  restart_ai: '/home/console-api/restart_ai.sh',
  jwt_key: process.env.JWT_KEY || 'a2V5Z2VuZXJhdG9y'
};
