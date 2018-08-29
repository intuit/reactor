
/**
 * Reactor root factory
 *
 * Returns the Reactor reducer based on processed spec
 */

import React from 'react';

/**
 * Get Reactor root component
 *
 * @param {Object} components - map of all components Reactor needs
 * @param {Class} urlManager - constructed url manager
 *
 * @return {Component} Reactor root component
 */

const getReactorRoot = (components, urlManager) => {
  return class ReactorRoot extends React.Component {
    constructor(props) {
      super(props);
      this.setPath(props.state);
    }

    componentWillReceiveProps(nextProps) {
      this.setPath(nextProps.state);
    }

    setPath(state) {
      urlManager.setPath(
        state.reactor.path.fullPath,
        state.reactor.navData
      );
    }

    getViewsFromState(state) {
      return state.reactor.views.map((view, i) => {
        const Component = components[view.component];
        return <Component {...this.props} key={i} />;
      });
    }

    render() {
      return (
        <section className="reactor-wrapper">
          {this.getViewsFromState(this.props.state)}
        </section>
      )
    }
  };
};

export { getReactorRoot };
