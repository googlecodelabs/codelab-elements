/**
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

const EventHandler = goog.require('goog.events.EventHandler');
const HTML5LocalStorage =
    goog.require('goog.storage.mechanism.HTML5LocalStorage');
const Templates = goog.require('googlecodelabs.CodelabSurvey.Templates');
const dom = goog.require('goog.dom');
const events = goog.require('goog.events');
const soy = goog.require('goog.soy');


/**
 * The prefix for all survey keys in local storage.
 * @const {string}
 */
const STORAGE_KEY_PREFIX = 'codelab-survey-';

/**
 * The id for the current survey.
 * @const {string}
 */
const SURVEY_ID_ATTR = 'survey-id';


/** @const {string} */
const DEFAULT_SURVEY_NAME = 'default-codelabs-survey';


/** @enum {string} */
const Selectors = {
  'OPTIONS_WRAPPER': '.mdc-radio__wrapper'
};


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
    this.surveyName_ = this.getAttribute(SURVEY_ID_ATTR) || DEFAULT_SURVEY_NAME;

    /** @private {!HTML5LocalStorage} */
    this.storage_ = new HTML5LocalStorage();

    /** @private {string} */
    this.storageKey_ = STORAGE_KEY_PREFIX + this.surveyName_;

    /** @private {!Object<string, !Object>} */
    this.storedData_ = {};

    /** @private {!EventHandler} */
    this.eventHandler_ = new EventHandler();
  }

  /**
   * @export
   * @override
   */
  connectedCallback() {
    this.checkStoredData_();
    this.updateDom_();
    this.bindEvents_();
  }

  bindEvents_() {
    const surveyQuestions = document.querySelectorAll(
      Selectors.OPTIONS_WRAPPER);
    surveyQuestions.forEach(el => {
      this.eventHandler_.listen(el, events.EventType.CLICK, (e) => {
        this.handleSurveyClick_(e.currentTarget);
      });
    });
  }

  handleSurveyClick_(surveyQuestionEl) {
    const labelEl = surveyQuestionEl.querySelector('label');
    const inputEl = surveyQuestionEl.querySelector('input');
    const answer = labelEl.textContent;

    if (inputEl) {
      inputEl.checked = true;
      const question = inputEl.name;
      this.storedData_[this.surveyName_][question] = answer;
      this.storage_.set(
        this.storageKey_, JSON.stringify(this.storedData_[this.surveyName_]));
    }
  }

  checkStoredData_() {
    const storedData = this.storage_.get(this.storageKey_);
    if (storedData) {
      this.storedData_[this.surveyName_] = /** @type {!Object} */ (
        JSON.parse(storedData));
    }
  }

  updateDom_() {
    const radioGroupEls = this.querySelectorAll('paper-radio-group');
    const questionEls = this.querySelectorAll('h4');
    const surveyQuestions = [];
    if (radioGroupEls.length && (questionEls.length == radioGroupEls.length)) {
      radioGroupEls.forEach((radioGroupEl, index) => {
        const surveyOptions = [];
        const polymerRadioEls = radioGroupEl.querySelectorAll(
          'paper-radio-button');
        dom.removeNode(radioGroupEl);
        polymerRadioEls.forEach(radioEl => {
          const title = radioEl.textContent;
          surveyOptions.push({
            radioId: this.normalizeIdField_(title),
            radioTitle: title
          });
        });
        surveyQuestions.push({
          question: questionEls[index].textContent,
          options: surveyOptions
        });
        dom.removeNode(questionEls[index]);
      });
      const updatedDom = soy.renderAsElement(Templates.survey, {
        surveyName: this.surveyName_,
        surveyQuestions: surveyQuestions
      });
      this.appendChild(updatedDom);
    }
    this.setAnsweredQuestions_();
  }

  setAnsweredQuestions_() {
    const surveyData = this.storedData_[this.surveyName_];
    if (surveyData) {
      Object.keys(surveyData).forEach(key => {
        const id = this.normalizeIdField_(surveyData[key]);
        const inp = this.querySelector(`[id="${id}"]`);
        if (inp) inp.checked = true;
      });
    }
  }

  normalizeIdField_(id) {
    return id.replace(/\s+/g, '-').toLowerCase();
  }
}

window.customElements.define('google-codelab-survey', CodelabSurvey);

exports = CodelabSurvey;
