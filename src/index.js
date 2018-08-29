
/**
 * Main module of Reactor.
 *
 * Expose a single initialization function, which returns
 * the reducer as well as the React root component.
 */

import { getReducer } from './reducer-factory';
import { getReactorRoot } from './reactor-root-factory';
import { processSpec } from './spec-processor';
import URLManager from './url-manager';

/**
 * initialize Reactor at runtime
 *
 * @param {Object} spec - the chosen navigation spec
 * @param {Object} components - key-value pairs of page-level React components
 *
 * @return {
 *   {Function} reactorReducer - Reactor Redux reducer
 *   {Class} RootComponent - React root component for the app to use
 * }
 */

const initialize = ({ spec, components, options = {} }) => {
  const { specNodes, urlToViewState } = processSpec(spec);
  const urlManager = new URLManager(spec, urlToViewState, options);
  const reactorReducer = getReducer(specNodes, urlManager, urlToViewState);
  const ReactorRoot = getReactorRoot(components, urlManager);

  return {
    reactorReducer,
    ReactorRoot
  };
};

export default { initialize };
