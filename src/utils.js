
const constructNavState = (node, viewStack, navData = {}, previousPath = null) => {
  const fullPath = viewStack.map((view) => view.segment)
    .concat(node.path.segment).filter((segment) => segment !== '')
    .join('/');

  return {
    name: node.name,
    customMetadata: node.customMetadata || {},
    path: {
      fullPath,
      urlAccess: node.path.urlAccess,
    },
    views: node.views,
    viewStack,
    navData,
    previousPath
  };
};

const kebabToCamel = (str) => {
  str = str.split('-').map((s) => {
    return s[0].toUpperCase() + s.slice(1);
  }).join('');
  return str[0].toLowerCase() + str.slice(1);
};

export {
  constructNavState,
  kebabToCamel
};
