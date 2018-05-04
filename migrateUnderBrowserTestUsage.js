const fs = require('fs');
const _ = require('lodash');

const stagingData = JSON.parse(fs.readFileSync('staging-personas.json', 'utf8'));
const oldV1Data = JSON.parse(fs.readFileSync('old-v1-personas.json', 'utf8'));

const updatedV1Data = {};

_.forEach(oldV1Data, (personaEntry) => {
  updatedV1Data[personaEntry.id] = personaEntry;
  const matchingStagingEntry = stagingData[personaEntry.id];
  if (matchingStagingEntry && matchingStagingEntry.underBrowserTestUsage) {
    updatedV1Data[personaEntry.id].underBrowserTestUsage = 
      matchingStagingEntry.underBrowserTestUsage;
  }
});

try {
  fs.writeFileSync('updated-v1-personas.json', JSON.stringify(updatedV1Data));
} catch (err) {
  console.log('Sorry, there was an error: ', err);
  process.exit(1);
}

process.exit(0);
