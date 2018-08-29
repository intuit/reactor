
import { kebabToCamel } from './utils';

/**
 * URL Manager
 *
 * Reactor's point of interaction with browser history API
 */

export default class URLManager {
  constructor(spec, urlToViewState, options) {
    this.spec = spec;
    this.urlToViewState = urlToViewState;
    this.options = options;
  }

  getPath() {
    if (this.options.customGetPath) {
      return this.options.customGetPath();
    } else if (this.options.usePushState) {
      return window.location.pathname;
    } else {
      return window.location.hash.substring(2);
    }
  }

  setPath(path, data) {
    path = path.split('/').map((segment) => {
      if (segment[0] !== ':') return segment;
      return data[kebabToCamel(segment.slice(1))];
    }).join('/');

    if (path != this.getPath()) {
      if (this.options.customRouting) {
        this.options.customRouting(path);
      } else if (this.options.usePushState) {
        const state = window.history.state;
        state.url = newPath;
        window.history.pushState(state, '', newPath);
      } else {
        this.ignoreHashChange = true;
        window.location.hash = '/' + path;
      }
    }

    if (this.options.postRouteChangeHook) {
      this.options.postRouteChangeHook();
    }
  }

  getViewState(path) {
    return this.urlToViewState.get(path);
  }
};
