
import { expect } from 'chai';

import { getReducer } from '../src/reducer-factory';
import { processSpec } from '../src/spec-processor';

import spec from './test-data/processed-spec';

const { specNodes, urlToViewState } = processSpec(spec);
const reducer = getReducer(specNodes, { getPath() { return 'items' } }, urlToViewState);

describe('reducer', () => {
  let currState = null;

  it('goes to items List for default state', () => {
    currState = reducer(currState);
    expect(currState).to.be.deep.equal(itemListState);
  });

  it('traverses decision node sad path', () => {
    currState = reducer(itemListState, {
      type: 'transition',
      name: 'process-items',
      data: { canProcessItems: false }
    });

    expect(currState).to.be.deep.equal(Object.assign(
      {},
      itemListState,
      { previousPath: 'items' }
    ));
  });

  it('traverses decision node happy path, and enters higher-order state', () => {
    currState = reducer(itemListState, {
      type: 'transition',
      name: 'process-items',
      data: { canProcessItems: true }
    });

    expect(currState).to.be.deep.equal(processItemsPreviewState);
  });

  it('does regular transition', () => {
    currState = reducer(processItemsPreviewState, {
      type: 'transition',
      name: 'submit-process-items'
    });

    expect(currState).to.be.deep.equal(processItemsConfirmationState);
  });

  it('exits higher-order state', () => {
    currState = reducer(processItemsConfirmationState, {
      type: 'transition',
      name: 'done'
    });

    expect(currState).to.be.deep.equal(Object.assign(
      {},
      itemListState,
      { previousPath: 'items/process-items/confirmation' }
    ));
  });
});

const itemListState = {
  name: 'item-list',
  customMetadata: {},
  path: {
    fullPath: 'items',
    urlAccess: true
  },
  views: [
    {
      type: "main",
      component: 'item-list'
    }
  ],
  viewStack: [
    {
      name: 'us regular',
      segment: 'items'
    }
  ],
  navData: {},
  previousPath: null
};

const processItemsPreviewState = {
  name: 'process-items-preview',
  customMetadata: {},
  path: {
    fullPath: 'items/process-items/preview',
    urlAccess: true
  },
  views: [
    {
      type: "main",
      component: 'process-items-preview'
    }
  ],
  viewStack: [
    {
      name: 'us regular',
      segment: 'items'
    },
    {
      name: 'process-items',
      segment: 'process-items'
    }
  ],
  navData: {},
  previousPath: 'items'
};

const processItemsConfirmationState = {
  name: 'process-items-confirmation',
  customMetadata: {},
  path: {
    fullPath: 'items/process-items/confirmation',
    urlAccess: false
  },
  views: [
    {
      type: "main",
      component: 'process-items-confirmation'
    }
  ],
  viewStack: [
    {
      name: 'us regular',
      segment: 'items'
    },
    {
      name: 'process-items',
      segment: 'process-items'
    }
  ],
  navData: {},
  previousPath: 'items/process-items/preview'
};
