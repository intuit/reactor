
/**
 * Reactor spec processor
 *
 * Turns unprocessed Reactor specs into indexed map and path-to-node trie
 */

import { constructNavState } from './utils';
import URLTrie from './url-trie';

/**
 * Get Reactor root component
 *
 * @param {Object} spec - map of all components Reactor needs
 *
 * @return {
 *   {Object} specNodes - name to node mapping
 *   {URLTrie} urlToViewState - React root component for the app to use
 * }
 */

const processSpec = (spec) => {
  const pathPrefix = [];
  const viewStack = [];
  const urlToViewState = new URLTrie();

  return processSpecInternal(spec, pathPrefix, viewStack, urlToViewState);
};

const processSpecInternal = (spec, pathPrefix, viewStack, urlToViewState) => {
  let specNodes = {};
  specNodes.metadata = spec.metadata;
  specNodes.metadata.fallbackSegment = specNodes.metadata.fallbackSegment ?
    specNodes.metadata.segment + '/' + specNodes.metadata.fallbackSegment :
    specNodes.metadata.segment;

  viewStack = viewStack.concat({
    name: spec.name,
    segment: spec.metadata.segment
  });

  spec.navSpecs.forEach((specNode) => {
    specNodes[specNode.name] = specNode;

    if (specNode.type === 'decision') {
    } else if (specNode.type === 'higher-order') {
      const subSpecResults = processSpecInternal(specNode, pathPrefix, viewStack, urlToViewState);
      // TODO refactor
      delete subSpecResults.specNodes.metadata;
      specNodes = Object.assign({}, specNodes, subSpecResults.specNodes);
    } else {
      const fullPath = viewStack.map((view) => view.segment)
        .concat(specNode.path.segment)
        .filter((segment) => segment !== '' && segment)
        .join('/');

      if (!specNode.path.urlAccess) {
        const fallbackSegment = specNode.path.fallbackSegment;
        specNode = spec.navSpecs.find((fallbackSpecNode) => {
          return fallbackSpecNode.type === undefined &&
                 fallbackSpecNode.path.urlAccess &&
                 fallbackSpecNode.path.segment === fallbackSegment;
        });
      }

      urlToViewState.put(fullPath, constructNavState(specNode, viewStack, {}));
    }
  });

  return {
    specNodes,
    urlToViewState
  };
};

export {
  processSpec
};
