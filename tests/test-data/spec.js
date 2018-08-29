
const list = {
  name: 'list',
  path: {
    pathPart: 'list',
    urlAccess: true,
  },
  view: {
    main: 'list-component-a'
  }
};

const addToListSummary = {
  name: 'add-to-list-summary',
  path: {
    pathPart: 'new',
    urlAccess: true,
  },
  view: {
    main: 'add-summary-component-b'
  }
};

list.transitions = [
  {
    name: 'add-to-list',
    to: 'add-to-list-summary'
  }
];

addToListSummary.transitions = [
  {
    name: 'back',
    to: 'list'
  }
];

export {
  list,
  addToListSummary
};
