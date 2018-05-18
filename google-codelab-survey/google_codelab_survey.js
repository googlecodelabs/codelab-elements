/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.module('googlecodelabs.CodelabSurvey');

const Templates = goog.require('googlecodelabs.CodelabSurvey.Templates');
const dom = goog.require('goog.dom');
const soy = goog.require('goog.soy');


/**
 * @extends {HTMLElement}
 */
class CodelabSurvey extends HTMLElement {

  constructor() {
    super();

    /**
     * The name of the survey
     * @private {string}
     */
    this.surveyName_ = this.getAttribute('survey-id') || '';
  }

  /**
   * @export
   * @override
   */
  connectedCallback() {
    this.updateDom_();
  }

  updateDom_() {
    const paperRadioGroupEl = this.querySelector('paper-radio-group');
    if (paperRadioGroupEl) {
      const polymerRadioEls = paperRadioGroupEl.querySelectorAll(
        'paper-radio-button');
      dom.removeNode(paperRadioGroupEl);
      polymerRadioEls.forEach(radioEl => {
        const title = radioEl.textContent;
        const updatedRadioEl = soy.renderAsElement(Templates.radioButton, {
          radioGroupName: this.surveyName_,
          radioId: title.replace(/\s+/g, '-').toLowerCase(),
          radioTitle: title
        });
        this.appendChild(updatedRadioEl);
      });
    }
  }
}

window.customElements.define('google-codelab-survey', CodelabSurvey);

exports = CodelabSurvey;
