
import { expect } from 'chai';

import URLTrie from '../src/url-trie';

describe('URLTrie', () => {
  let urlToViewState;

  beforeEach(() => {
    urlToViewState = new URLTrie();
  });

  it('matches simple path', () => {
    urlToViewState.put('aaa', { name: 'aaa' });
    let viewState = urlToViewState.get('aaa');
    expect(viewState.name).to.be.equal('aaa');
  });

  it('matches nested path', () => {
    urlToViewState.put('aaa/b/cc', { name: 'abc' });
    let viewState = urlToViewState.get('aaa/b/cc');
    expect(viewState.name).to.be.equal('abc');
  });

  it('matches simply path with data', () => {
    urlToViewState.put(':aaa', { name: 'abc' });
    let viewState = urlToViewState.get('hello');
    expect(viewState.name).to.be.equal('abc');
    expect(viewState.navData.aaa).to.be.equal('hello');
  });

  it('matches nested path with data', () => {
    urlToViewState.put(':aa-a/:b-b-b/:cc', { name: 'aaa' });
    let viewState = urlToViewState.get('testdata/2/3');
    expect(viewState.name).to.be.equal('aaa');
    expect(viewState.navData).to.be.deep.equal({
      aaA: 'testdata',
      bBB: '2',
      cc: '3'
    });
  });
});
