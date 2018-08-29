
import { kebabToCamel } from './utils';

/**
 * Custom trie-based data structure for urls with wildcards
 */

class URLTrie {
  constructor() {
    this.rootNode = new URLTrieNode('***root***');
  }

  get(path) {
    let node = this.rootNode;

    path = path.match(/\/*(.*)/)[1];
    const segments = path.split('/');

    return this._matchNext(this.rootNode, segments);
  }

  put(path, viewState) {
    let node = this.rootNode;

    const segments = path.split('/');

    for (const segment of segments) {
      node = node.createOrGetNext(segment);
    }

    node.setValue(viewState);
  }

  _matchNext(node, segments) {
    const nextSegment = segments[0];
    const remainingSegments = segments.slice(1);

    const nextNodes = node.getAllNextMatches(nextSegment);
    if (nextNodes.length === 0) return null;

    let result;
    if (segments.length === 1) {
      result = {
        viewState: nextNodes[0].getValue(),
        nextNode: nextNodes[0]
      };
    } else {
      result = nextNodes.map((nextNode) => {
        return {
          viewState: this._matchNext(nextNode, remainingSegments),
          nextNode
        };
      }).filter((result) => {
        return result.viewState !== null;
      })[0];
    }

    if (!result) return null;

    if (result.nextNode.segment[0] === ':') {
      const dataKey = kebabToCamel(result.nextNode.segment.substring(1));
      result.viewState.navData[dataKey] = nextSegment;
    }

    return result.viewState;
  }
};

class URLTrieNode {
  constructor(segment) {
    this.segment = segment;
    this.next = {};
  }

  createOrGetNext(segment) {
    if (!this.next[segment]) {
      this.next[segment] = new URLTrieNode(segment);
    }
    return this.next[segment];
  }

  setValue(value) {
    if (!value.navData) value.navData = {};
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  getAllNextMatches(segment) {
    const result = Object.keys(this.next).reduce((arr, nextSegment) => {
      if (nextSegment[0] === ':' || nextSegment === segment) {
        arr = arr.concat(this.next[nextSegment]);
      }
      return arr;
    }, []);

    return result;
  }
};

export default URLTrie;
