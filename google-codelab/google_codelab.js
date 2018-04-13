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

goog.module('googlecodelabs.Codelab');

const Templates = goog.require('googlecodelabs.Codelab.Templates');
const dom = goog.require('goog.dom');
const soy = goog.require('goog.soy');

/** @const {string} */
const TITLE_ATTR = 'title';

/** @const {string} */
const ENVIRONMENT_ATTR = 'environment';

/** @const {string} */
const CATEGORY_ATTR = 'category';

/** @const {string} */
const FEEDBACK_LINK_ATTR = 'feedback-link';

/** @const {string} */
const SELECTED_ATTR = 'selected';

/** @const {string} */
const LAST_UPDATED_ATTR = 'last-updated';

/**
 * @extends {HTMLElement}
 */
class Codelab extends HTMLElement {

  constructor() {
    super();

    /** @private {?Element} */
    this.drawer_ = null;

    /** @private {?Element} */
    this.stepsContainer_ = null;

    /** @private {?Element} */
    this.titleContainer_ = null;

    /** @private {!Array<!Element>} */
    this.steps_ = [];

    /** @private {number}  */
    this.currentSelectedStep_ = -1;

    /** @private {boolean} */
    this.hasSetup_ = false;
  }
  /**
   * @export
   * @override
   */
  connectedCallback() {
    if (!this.hasSetup_) {
      this.setupDom_();
    }

    this.setupSteps_();
    this.updateTitle_();
    this.updateTimeRemaining_();
    this.showSelectedStep_();
  }

  /**
   * @return {!Array<string>}
   * @export
   */
  static get observedAttributes() {
    return [TITLE_ATTR, ENVIRONMENT_ATTR, CATEGORY_ATTR, FEEDBACK_LINK_ATTR,
        SELECTED_ATTR, LAST_UPDATED_ATTR];
  }


  /**
   * @param {string} attr
   * @param {?string} oldValue
   * @param {?string} newValue
   * @param {?string} namespace
   * @export
   * @override
   */
  attributeChangedCallback(attr, oldValue, newValue, namespace) {
    switch (attr) {
      case TITLE_ATTR:
        this.updateTitle_();
        break;
      case SELECTED_ATTR:
        this.showSelectedStep_();
        break;
    }
  }

  /**
   * @private
   */
  updateTitle_() {
    const title = this.getAttribute('title');
    if (!title || !this.titleContainer_) {
      return;
    }
    const newTitleEl =  soy.renderAsElement(Templates.title, {title});
    const oldTitleEl = this.titleContainer_.querySelector('h1');
    if (oldTitleEl) {
      dom.replaceNode(newTitleEl, oldTitleEl);
    } else {
      dom.appendChild(this.titleContainer_, newTitleEl);
    }
  }

  /**
   * @private
   */
  updateTimeRemaining_() {
    if (!this.titleContainer_) {
      return;
    }

    let time = 0;

    const newTimeEl =  soy.renderAsElement(Templates.timeRemaining, {time});
    const oldTimeEl = this.titleContainer_.querySelector('#time-remaining');
    if (oldTimeEl) {
      dom.replaceNode(newTimeEl, oldTimeEl);
    } else {
      dom.appendChild(this.titleContainer_, newTimeEl);
    }
  }

  /**
   * @private
   */
  setupSteps_() {
    this.steps_.forEach((step, index) => {
      step = /** @type {!Element} */ (step);
      step.setAttribute('step', index+1);
    });
  }

  showSelectedStep_() {
    let selected = 0;
    if (this.hasAttribute(SELECTED_ATTR)) {
      selected = parseInt(this.getAttribute(SELECTED_ATTR), 10);
    }

    if (this.currentSelectedStep_ !== -1) {
      this.steps_[this.currentSelectedStep_].removeAttribute(SELECTED_ATTR);
    }

    selected = Math.min(Math.max(0, selected), this.steps_.length - 1);

    this.steps_[selected].setAttribute(SELECTED_ATTR, '');
    this.currentSelectedStep_ = selected;
  }

  /**
   * @private
   */
  setupDom_() {
    this.steps_ = Array.from(this.querySelectorAll('google-codelab-step'));

    soy.renderElement(this, Templates.structure);
    
    this.drawer_ = this.querySelector('#drawer');
    console.log(this.drawer_);
    this.titleContainer_ = this.querySelector('#codelab-title');
    this.stepsContainer_ = this.querySelector('#steps');

    this.steps_.forEach((step) => dom.appendChild(this.stepsContainer_, step));
    if (!this.hasAttribute(SELECTED_ATTR)) {
      this.setAttribute(SELECTED_ATTR, 0);
    }
    this.hasSetup_ = true;
  }
}

window.customElements.define('google-codelab', Codelab);

exports = Codelab;
