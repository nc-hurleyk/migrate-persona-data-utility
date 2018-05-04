const fs = require('fs');
const _ = require('lodash');

function arrayToHash(array) {
  return _.reduce(array, (result, value, key) => {
    if (value) {
      result[key] = value;
    }
    return result;
  }, {});
}

try {
  const data = JSON.parse(fs.readFileSync('array.json', 'utf8'));
  fs.writeFileSync('hash.json', JSON.stringify(arrayToHash(data)));
} catch (err) {
  console.log('Sorry, there was an error: ', err);
  process.exit(1);
}

process.exit(0);
