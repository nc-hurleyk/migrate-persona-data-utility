const fs = require('fs');
const _ = require('lodash');

const existingResults = JSON.parse(fs.readFileSync('john-hancock-expected-results.json', 'utf8'));

const updatedResults = {};

_.forEach(existingResults, (resultEntry) => {
  updatedResults[resultEntry.personaId] = resultEntry;
});

try {
  fs.writeFileSync('john-hancock-updated-results.json', JSON.stringify(updatedResults));
} catch (err) {
  console.log('Sorry, there was an error: ', err);
  process.exit(1);
}

process.exit(0);