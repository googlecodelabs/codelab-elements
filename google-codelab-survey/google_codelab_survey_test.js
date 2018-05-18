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

goog.module('googlecodelabs.CodelabSurveyTest');
goog.setTestOnly();

const CodelabSurvey = goog.require('googlecodelabs.CodelabSurvey');
const testSuite = goog.require('goog.testing.testSuite');
goog.require('goog.testing.asserts');
goog.require('goog.testing.jsunit');

testSuite({

  testCodelabSurveyUpgraded() {
    const div = document.createElement('div');
    div.innerHTML = '<google-codelab-survey id="test"><paper-radio-group>' +
      '<paper-radio-button>Title Text</paper-radio-button>' +
      '</paper-radio-group></google-codelab-survey>';
    document.body.appendChild(div);
    const radioInputEl = document.querySelector('input#title-text');
    const radioLabelEl = document.querySelector('label#title-text-label');
    assertNotNull(radioInputEl);
    assertNotNull(radioLabelEl);
    assertEquals('Title Text', radioLabelEl.textContent);
  },
});
