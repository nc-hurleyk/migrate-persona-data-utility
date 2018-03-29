const { isEqual } = require('lodash');
const fs = require('fs');

const data = fs.readFileSync('rawPersonaData.json', 'utf8');
const personas = JSON.parse(data);
const personaAccounts = [];

function findOrCreatePersonaAccount(account) {
  const accountToFindOrCreate = {
    contributions: {},
    subAccounts: {},
    profile: account.id
  };

  // this will be an array of objects in the form { id: xx }
  const contributionsWithIds = Object.values(account.contributions);
  contributionsWithIds.forEach((element) => {
    accountToFindOrCreate.contributions[element.id] = true;
  });

  const subAccountsWithIds = Object.values(account.subAccounts);
  subAccountsWithIds.forEach((element) => {
    accountToFindOrCreate.subAccounts[element.id] = true;
  });

  if (!personaAccounts.length) {
    accountToFindOrCreate.id = '1';
    personaAccounts.push(accountToFindOrCreate);
    return accountToFindOrCreate.id;
  }

  const foundAccount = personaAccounts.find((personaAccount) => {
    const sorter = (a,b) => a - b;
    return (
      isEqual(Object.keys(personaAccount.contributions).sort(sorter), Object.keys(accountToFindOrCreate.contributions).sort(sorter)) &&
      isEqual(Object.keys(personaAccount.subAccounts).sort(sorter), Object.keys(accountToFindOrCreate.subAccounts).sort(sorter)) &&
      personaAccount.profile === accountToFindOrCreate.profile
    );
  });

  if (foundAccount) {
    return foundAccount.id;
  } else {
    accountToFindOrCreate.id = String(personaAccounts.length + 1);
    personaAccounts.push(accountToFindOrCreate);
    return accountToFindOrCreate.id;
  }
}

personas.forEach((persona) => {
  persona.id = persona.personaId;
  delete persona.personaId;

  persona.profile = persona.profileId;
  delete persona.profileId;

  const accountIds = Object.values(persona.accounts).map(findOrCreatePersonaAccount);
  persona.accounts = {};
  accountIds.forEach((id) => {
    persona.accounts[id] = true;
  });

  if (persona.spouseProfileId) {
    persona.spouse = {
      profile: persona.spouseProfileId
    };
    delete persona.spouseProfileId;
  }
});

try {
  fs.writeFileSync('Personas.json', JSON.stringify(personas));
} catch (err) {
  console.log('Error writing persona JSON: ', err);
  process.exit(1);
}

console.log('Persona json written successfully.');

try {
  fs.writeFileSync('PersonaAccounts.json', JSON.stringify(personaAccounts));
} catch (err) {
  console.log('Error writing persona account JSON: ', err);
  process.exit(1);
}

console.log('PersonaAccount json written successfully.');
process.exit(0);
