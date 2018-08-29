
import React from 'react';
import * as ReactShallowUtils from 'react-shallow-testutils';
import ReactTestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import { getReactorRoot } from '../src/reactor-root-factory';
import URLManager from '../src/url-manager';

describe('root component factory', () => {
  class TestList extends React.Component {
    render() {
      return <div>Hello, World!</div>;
    }
  };

  const components = {
    'test-list': TestList
  };

  const state = {
    reactor: {
      name: 'test-list',
      navData: {},
      path: {
        segment: 'testing/path',
        urlAccess: true
      },
      views: [
        {
          type: 'main',
          component: 'test-list'
        }
      ],
      viewStack: [
        {
          name: 'test stack',
          path: 'testing'
        }
      ]
    }
  };

  const store = () => true;

  class FakeURLManager {
    setPath() {}
  };

  it("Should Render", () => {
    const ReactorRoot = getReactorRoot(components, new FakeURLManager(), store);

    const renderer = ReactTestUtils.createRenderer();
    renderer.render(<ReactorRoot state={state} />);
    const component = renderer.getRenderOutput();

    expect(component).to.be.an('object');
    expect(ReactShallowUtils.isDOMComponent(component)).to.equal(true);
  });
});
