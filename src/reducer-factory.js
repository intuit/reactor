
 /**
  * Reactor reducer factory
  *
  * Returns the Reactor reducer based on processed spec
  */

import { constructNavState } from './utils';

/**
 * Get Reactor reducer
 *
 * @param {Object} specNodes - processed spec nodes
 * @param {String} initialPath - path at store init time
 * @param {Class} urlToViewState - urlToViewState trie
 *
 * @return {function} Reactor reducer
 */

const getReducer = (specNodes, urlManager, urlToViewState) => {
  return (state, action) => {
    if (!state || action.type === 'url-change') {
      const initialState = buildInitialState(urlManager, urlToViewState);
      return initialState ?
        initialState :
        getFallbackState(specNodes, urlToViewState);
    }

    if (action.type !== 'transition') return state;

    let { nextNode, nextViewStack, navData } = traverse({
      nextNode: specNodes[state.name],
      nextViewStack: state.viewStack,
      nextAction: action,
      navData: buildNavData(state.navData, action.data),
      specNodes
    });

    if (!nextNode) return getFallbackState(specNodes, urlToViewState);
    return constructNavState(nextNode, nextViewStack, navData, state.path.fullPath);
  };
};

const buildInitialState = (urlManager, urlToViewState) => {
  return urlToViewState.get(urlManager.getPath());
};

const buildNavData = (navData, data) => {
  navData = Object.assign({}, navData, data);
  Object.keys(navData).forEach((key) => {
    if (navData[key] === undefined) delete navData[key];
  });
  return navData;
};

const traverse = ({ nextNode, nextViewStack, nextAction, navData, specNodes }) => {
  while (nextAction) {
    let traverseResult = traverseSingleStep({
      currentNode: nextNode,
      viewStack: nextViewStack,
      navData,
      action: nextAction,
      specNodes
    });

    nextNode = traverseResult.nextNode;
    nextViewStack = traverseResult.nextViewStack;
    nextAction = traverseResult.nextAction;
    navData = traverseResult.navData;
  }

  return { nextNode, nextViewStack, navData };
};

const traverseSingleStep = ({currentNode, viewStack, navData, action, specNodes}) => {
  let nextNode, nextViewStack = viewStack, nextAction, transition = {};

  if (action === 'entry') {
    nextNode = specNodes[currentNode.metadata.entry];
  } else {
    transition = findTransition(currentNode, action);
    if (transition.data) navData = buildNavData(navData, transition.data);
  }

  if (transition.escalate) return traverseEscalate(specNodes, nextViewStack, transition);
  if (transition.to) nextNode = specNodes[transition.to];

  if (nextNode.type === 'decision') {
    nextAction = getDecisionNodeOutcome(nextNode, navData);
  } else if (nextNode.type === 'higher-order') {
    nextViewStack = nextViewStack.concat({
      name: nextNode.name,
      segment: nextNode.metadata.segment
    });
    nextAction = 'entry';
  }

  return {
    nextNode,
    nextViewStack,
    nextAction,
    navData
  }
};

const findTransition = (currentNode, action) => {
  let transition = currentNode.transitions.find((transition) => {
    return transition.name === action.name;
  });

  if (!transition) {
    throw new Error(`
      Transition not found, action: ${JSON.stringify(action)},
      valid transitions: ${JSON.stringify(currentNode.transitions)},
      currently at ${currentNode.name}
    `);
  }

  return transition;
};

const traverseEscalate = (specNodes, nextViewStack, transition) => {
  const nextNode = specNodes[nextViewStack[nextViewStack.length - 1].name];
  nextViewStack = nextViewStack.slice(0, -1);
  const nextAction = {
    name: transition.escalate
  };

  return {
    nextNode,
    nextViewStack,
    nextAction
  };
};

const getDecisionNodeOutcome = (nextNode, navData) => {
  let outcome = nextNode.outcomes.find((outcome) => {
    if (outcome.value instanceof RegExp) {
      return navData[outcome.attribute] &&
             navData[outcome.attribute].match(outcome.value);
    } else {
      return outcome.value === navData[outcome.attribute];
    }
  });
  if (!outcome) outcome = nextNode.defaultOutcome;

  if (!outcome) {
    throw new Error([
      `Could not match outcome`,
      `Valid outcomes: ${JSON.stringify(nextnode.outcomes, null, 2)}`,
      `Action data: ${JSON.stringify(action.data, null, 2)}`
    ].join('\n'));
  }

  return outcome;
};

const getFallbackState = (specNodes, urlToViewState) => {
  const fallbackSegment = specNodes.metadata.fallbackSegment;
  const viewState = urlToViewState.get(fallbackSegment);

  if (!viewState) throw new Error(`Could not find fallback segment ${fallbackSegment}`);
  return viewState;
};

export { getReducer };
