/**
 * Expose
 */

module.exports = {
  db:
    process.env.MONGODB_URL ||
    'mongodb://darvis:darvis123@ds351987.mlab.com:51987/darvis',
  mode: 'windows',
  path: '/home/darvis',
  jwt_key: process.env.JWT_KEY || 'a2V5Z2VuZXJhdG9y'
};
