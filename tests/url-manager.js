
import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import URLManager from '../src/url-manager';
import URLTrie from '../src/url-trie';

const urlToViewState = new URLTrie();
urlToViewState.put('test', { result: 'test-state' });
urlToViewState.put('testing/longer/path', { result: 'test-longer-state' });
urlToViewState.put('testing/:id/functionality', { result: 'test-data-state' });

describe('URL Manager', () => {
  jsdom();

  let urlManager;

  before(() => {
    urlManager = new URLManager({}, urlToViewState, () => {});
  });

  describe('setPath', () => {
    it('should handle simple path', () => {
      const path = 'example/new/path';
      urlManager.setPath(path, {});
      expect(window.location.hash, 'browser hash should be new path').to.equal('#/' + path);
    });

    it('should handle path with data', () => {
      const path = 'example/:a/:b/end';
      const completePath = 'example/1/2/end';
      const data = { a: 1, b: 2 };

      urlManager.setPath(path, data);
      expect(window.location.hash, 'browser hash should have url param values').to.equal('#/' + completePath);
    });
  });

  describe('getViewState', () => {
    it('should handle simple path', () => {
      const path = 'test';
      const viewState = urlManager.getViewState(path);
      expect(viewState.result, 'should be test-state').to.equal('test-state');
    });

    it('should handle multi-level path', () => {
      const path = 'testing/longer/path';
      const viewState = urlManager.getViewState(path);
      expect(viewState.result, 'should be test-longer-state').to.equal('test-longer-state');
    })

    it('should handle path with data', () => {
      const path = 'testing/1337/functionality';
      const viewState = urlManager.getViewState(path);
      expect(viewState.result, 'should be test-data-state').to.equal('test-data-state');
    });

    it('should handle non-existent path', () => {
      const path = "/path/doesnot/exist";
      const viewState = urlManager.getViewState(path);
      expect(viewState, 'should be null').to.equal(null);
    });
  });
});
