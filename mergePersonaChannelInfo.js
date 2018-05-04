const _ = require('lodash');
const fs = require('fs');

const personaData = fs.readFileSync('Personas-merged.json', 'utf8');
const personas = JSON.parse(personaData);

const channelData = fs.readFileSync('persona-channels.json', 'utf8');
const channels = JSON.parse(channelData);

const personasClone = _.cloneDeep(personas);

personasClone.forEach((persona) => {
  if (!persona) {
    return;
  }
  
  const foundChannel = _.find(channels, (channel) => channel.personaId === persona.id);
  if (!foundChannel) {
    return;
  }

  if (!persona.underBrowserTestUsage) {
    persona.underBrowserTestUsage = {};
  } 

  if (foundChannel.ui) {
    // Shared by NC, NC-D, TA, and JH
    // add underBrowserTestUsage: { <tenant>: { retail: { userSeederService: true }}}
    ['john-hancock', 'nextcapital', 'nextcapital-discretionary', 'transamerica'].forEach((tenant) => {
      if (!persona.underBrowserTestUsage[tenant]) {
        persona.underBrowserTestUsage[tenant] = {};
      }

      if (!persona.underBrowserTestUsage[tenant].retail) {
        persona.underBrowserTestUsage[tenant].retail = {};
      }

      persona.underBrowserTestUsage[tenant].retail.userSeederService = true;
    });
  }

  // if (foundChannel.recordKeeper) {
  //   // Check for workplace personas - 909-1022
  //   // add underBrowserTestUsage: { 'john-hancock': { workplace: { rkStubServer: true }}}
  //   const idAsNumber = Number(persona.id);
  //   if (idAsNumber >= 909 && idAsNumber <= 1022) {
  //     persona.underBrowserTestUsage['john-hancock'] = {
  //       workplace: { rkStubServer: true }
  //     };
  //   } else {
  //   // Otherwise, flag as retail - only RKs right now are JH and TA
  //   // add underBrowserTestUsage: { <tenant>: { retail: { rkStubServer: true }}}
  //     ['john-hancock', 'transamerica'].forEach((tenant) => {
  //       persona.underBrowserTestUsage[tenant] = {
  //         retail: { rkStubServer: true }
  //       };
  //     });
  //   }
  // }

  if (foundChannel.russell) {
    // add underBrowserTestUsage: { russell: { workplace: { rkStubServer: true }}}
    persona.underBrowserTestUsage['russell'] = {
      workplace: { rkStubServer: true }
    };
  }
});

try {
  fs.writeFileSync('Personas-merged-v2.json', JSON.stringify(personasClone));
} catch (err) {
  console.log('Error writing persona JSON: ', err);
  process.exit(1);
}

console.log('Persona json modified successfully.');
process.exit(0);
