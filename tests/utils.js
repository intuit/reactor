
import { expect } from 'chai';

import { constructNavState, kebabToCamel } from '../src/utils';

const nodeWithPath = {
  name: 'node-with-path',
  path: {
    segment: 'test',
    urlAccess: true
  },
  transitions: [],
  views: [
    {
      type: 'main',
      component: 'test-component'
    }
  ]
};

const nodeNoPath = {
  name: 'node-no-path',
  path: {
    segment: '',
    urlAccess: false
  },
  transitions: [],
  views: [
    {
      type: 'main',
      component: 'test-component'
    }
  ]
};

const viewStackOnePath = [
  {
    name: '',
    segment: 'testing'
  },
  {
    name: 'empty',
    segment: ''
  }
];

const viewStackMultiplePaths = [
  {
    name: 'test one',
    segment: 'testingOne'
  },
  {
    name: 'test two',
    segment: 'testingTwo'
  },
  {
    name: 'test three',
    segment: 'testingThree'
  },
  {
    name: 'empty',
    segment: ''
  }
];

describe('utils', () => {
  describe('Kebab-Camel test', () => {
    it('Kebab-Camel tests', () => {
      const resultOne = kebabToCamel('noHyphens'),
        resultTwo = kebabToCamel('ALLCAPS'),
        resultThree = kebabToCamel('one-hyphen'),
        resultFour = kebabToCamel('there-are-multiple-hyphens-here');

      expect(resultOne, "No change should happen to 'noHyphens'").to.equal("noHyphens");
      expect(resultTwo, "The first letter should be lowercase").to.equal("aLLCAPS");
      expect(resultThree, "Should remove hyphen and capitalize H").to.equal("oneHyphen");
      expect(resultFour, "Convert Multiple Hyphens").to.equal("thereAreMultipleHyphensHere");
    });
  });

  describe('Construct Nav State tests', () => {
    it('Nav State with node with path, viewStack with one path', () => {
      const navState = new constructNavState(nodeWithPath, viewStackOnePath, {});

      expect(navState.name, 'Nav State name is correct').to.equal(nodeWithPath.name);
      expect(navState.path.fullPath, 'Nav State path should be correct with one slash').to.equal('testing/test');
      expect(navState.path.urlAccess, 'URL Access should be same as nodeWithPath').to.equal(nodeWithPath.path.urlAccess);
      expect(navState.view, 'Nav State view should be same as nodes view').to.deep.equal(nodeWithPath.view);
      expect(navState.viewStack, 'Nav State\'s view stack should remain the same').to.deep.equal(viewStackOnePath);
      expect(navState.navData, 'Nav Data should be empty').to.be.empty;
    });

    it('Nav State with node with no path, viewStack with one path', () => {
      const navState = new constructNavState(nodeNoPath, viewStackOnePath, {});

      expect(navState.name, 'Nav State name is correct').to.equal(nodeNoPath.name);
      expect(navState.path.fullPath, 'Nav State path should be correct with no slashes').to.equal('testing');
      expect(navState.path.urlAccess, 'URL Access should be same as nodeNoPath').to.equal(nodeNoPath.path.urlAccess);
      expect(navState.view, 'Nav State view should be same as nodes view').to.deep.equal(nodeNoPath.view);
      expect(navState.viewStack, 'Nav State\'s view stack should remain the same').to.deep.equal(viewStackOnePath);
      expect(navState.navData, 'Nav Data should be empty').to.be.empty;
    });

    it('Nav State with node with path, viewStack with multiple paths', () => {
      const navState = new constructNavState(nodeWithPath, viewStackMultiplePaths, {});

      expect(navState.name, 'Nav State name is correct').to.equal(nodeWithPath.name);
      expect(navState.path.fullPath, 'Nav State path should be correct three slashes').to.equal('testingOne/testingTwo/testingThree/test');
      expect(navState.path.urlAccess, 'URL Access should be same as nodeWithPath').to.equal(nodeWithPath.path.urlAccess);
      expect(navState.view, 'Nav State view should be same as nodes view').to.deep.equal(nodeWithPath.view);
      expect(navState.viewStack, 'Nav State\'s view stack should remain the same').to.deep.equal(viewStackMultiplePaths);
      expect(navState.navData, 'Nav Data should be empty').to.be.empty;
    });

    it('Nav State with node with no path, viewStack with multiple paths', () => {
      const navState = new constructNavState(nodeNoPath, viewStackMultiplePaths, {});

      expect(navState.name, 'Nav State name is correct').to.equal(nodeNoPath.name);
      expect(navState.path.fullPath, 'Nav State path should be correct with double slashes').to.equal('testingOne/testingTwo/testingThree');
      expect(navState.path.urlAccess, 'URL Access should be same as nodeWithPath').to.equal(nodeNoPath.path.urlAccess);
      expect(navState.view, 'Nav State view should be same as nodes view').to.deep.equal(nodeNoPath.view);
      expect(navState.viewStack, 'Nav State\'s view stack should remain the same').to.deep.equal(viewStackMultiplePaths);
      expect(navState.navData, 'Nav Data should be empty').to.be.empty;
    });
  });
});
