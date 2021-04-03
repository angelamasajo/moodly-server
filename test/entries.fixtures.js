function makeEntriesArray() {
  return [
    {
      author: 1,
      id: 1,
      title: "First day of work",
      "description": "I am excited because here are the reasons, here is what happened and why.",
      mood: "excited",
      modified: '2029-01-22T16:28:32.615Z',
    },
    {
      author: 1,
      id: 2,
      title: "Rainy day",
      "description": "I am sad because here are the reasons, here is what happened and why.",
      mood: "sad",
      modified: '2029-01-22T16:28:32.615Z',

    },
    {
      author: 1,
      id: 3,
      title: "App not working",
      "description": "I am frustrated because here are the reasons, here is what happened and why.",
      mood: "frustrated",
      modified: '2029-01-22T16:28:32.615Z',

    },
    {
      author: 1,
      id: 4,
      title: "Social justice",
      "description": "I am anxious because here are the reasons, here is what happened and why.",
      mood: "anxious",
      modified: '2029-01-22T16:28:32.615Z',
    }
  ];
}

function makeMaliciousEntry() {
  const maliciousEntry = {
    id: 9000,
    title: "hahahaha",
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    mood: "sad",
  };
  const expectedEntry = {
    ...maliciousEntry,
    title: "hahahaha",
    care_details: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    toxicity: "sad",
  };
  return {
    maliciousEntry,
    expectedEntry,
  };
}

module.exports = {
  makeEntriesArray,
  makeMaliciousEntry,
};
