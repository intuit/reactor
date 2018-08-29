
import { processSpec } from '../src/spec-processor.js';
import { list, addToListSummary } from './test-data/spec';
import { expect } from 'chai';

describe('spec processor', () => {
  const spec = {
    name: 'regular',
    metadata: {
      region: 'us',
      path: 'initial-path',
      initialSegment: 'initial-path',
      fallbackSegment: '404'
    },
    navSpecs: [
      list,
      addToListSummary
    ]
  };

  const count = (obj) => Object.keys(obj).length

  it('should parse into run-time spec', () => {
    expect(spec).to.be.an('object');
    expect(spec).to.have.all.keys('name', 'metadata', 'navSpecs');
    expect(spec.navSpecs).to.have.length.above(0);
    expect(spec).to.have.property('navSpecs')
      .that.is.an('array')
      .with.deep.property('[0]')
      .that.has.all.keys('name', 'path', 'transitions', 'view');

    const { specNodes, urlToViewState } = processSpec(spec);

    expect(specNodes.metadata).to.deep.equal(spec.metadata);

    let keyList =  Object.keys(spec.navSpecs[0]);
    keyList.forEach((key) => {
      expect(specNodes['list']).to.have.deep.property(key, spec.navSpecs[0][key]);
    });
  });
});
