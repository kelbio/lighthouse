/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const i18n = require('../lib/i18n/i18n.js');

const UIStrings = {
  /** Descriptive title of a diagnostic audit that provides the element that was determined to be the Largest Contentful Paint. */
  title: 'Largest Contentful Paint element',
  /** Description of a Lighthouse audit that tells the user that the element shown was determined to be the Largest Contentful Paint. */
  description: 'This is the element that was identified as the Largest Contentful Paint. ' +
    '[Learn More](https://web.dev/lighthouse-largest-contentful-paint)',
  /** [ICU Syntax] Label for the audit identifying if an element was found. */
  displayValue: `{itemCount, plural,
    =1 {1 element found}
    other {# elements found}
    }`,
  /** Label for the Element column in the Largest Contenful Paint Node event data table. */
  columnHeader: 'Element',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

class LargestContentfulPaintNode extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'largest-contentful-paint-node',
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      requiredArtifacts: ['TraceNodes'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {LH.Audit.Product}
   */
  static audit(artifacts) {
    const lcpNode =
      artifacts.TraceNodes.find(node => node.metricTag === 'largest-contentful-paint');
    const lcpNodeDetails = [];
    if (lcpNode) {
      lcpNodeDetails.push({
        node: /** @type {LH.Audit.Details.NodeValue} */ ({
          type: 'node',
          path: lcpNode.nodePath,
          selector: lcpNode.selector,
          nodeLabel: lcpNode.nodeLabel,
          snippet: lcpNode.snippet,
        }),
      });
    }

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'node', itemType: 'node', text: str_(UIStrings.columnHeader)},
    ];

    const details = Audit.makeTableDetails(headings, lcpNodeDetails);

    const displayValue = str_(UIStrings.displayValue, {itemCount: lcpNodeDetails.length});

    return {
      score: 1,
      displayValue,
      details,
    };
  }
}

module.exports = LargestContentfulPaintNode;
module.exports.UIStrings = UIStrings;