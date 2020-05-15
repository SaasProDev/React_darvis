
exports.generateKey = function (length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const clength = characters.length;
  for(let i = 0 ; i < length ; i++) {
    result += characters.charAt(Math.floor(Math.random() * clength));
  }
  return result;
}