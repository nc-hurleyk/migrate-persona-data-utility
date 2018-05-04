const fs = require('fs');
const _ = require('lodash');

const stagingData = JSON.parse(fs.readFileSync('staging-personas.json', 'utf8'));

let rawIDs = [ 'userID:609',
  'userID:610',
  'userID:611',
  'userID:612',
  'userID:613',
  'userID:614',
  'userID:615',
  'userID:616',
  'userID:617',
  'userID:618',
  'userID:710',
  'userID:712',
  'userID:716',
  'userID:724',
  'userID:730',
  'userID:731',
  'userID:738',
  'userID:741',
  'userID:742',
  'userID:744',
  'userID:745',
  'userID:747',
  'userID:748',
  'userID:749',
  'userID:750',
  'userID:751',
  'userID:753',
  'userID:766',
  'userID:769',
  'userID:770',
  'userID:771',
  'userID:772',
  'userID:773',
  'userID:774' ];

rawIDs = _.map(rawIDs,(ID) => ID.split(':')[1]);
const stagingDataClone = _.cloneDeep(stagingData);

_.forEach(rawIDs, (ID) => {
  const personaToModify = _.find(stagingDataClone, (persona) => persona.id === ID);
  personaToModify.underBrowserTestUsage['russell'] = {
    workplace : {
      rkStubServer : true
    }
  };
});

try {
  fs.writeFileSync('updated-v1-personas.json', JSON.stringify(stagingDataClone));
} catch (err) {
  console.log('Sorry, there was an error: ', err);
  process.exit(1);
}

process.exit(0);