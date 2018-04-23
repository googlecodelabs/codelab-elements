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

goog.module('googlecodelabs.Codelabs');

const EventHandler = goog.require('goog.events.EventHandler');
const Templates = goog.require('googlecodelabs.Codelabs.Templates');
const dom = goog.require('goog.dom');
const soy = goog.require('goog.soy');

/** @const {string} */
const CATEGORY_ATTR = 'category';

/** @const {string} */
const TITLE_ATTR = 'title';

/** @const {string} */
const DURATION_ATTR = 'duration';

/** @const {string} */
const UPDATED_ATTR = 'updated';

/** @const {string} */
const TAGS_ATTR = 'tags';


/**
 * @extends {HTMLElement}
 */
class Codelabs extends HTMLElement {
  constructor() {
    super();

    /** @private {!EventHandler} */
    this.eventHandler_ = new EventHandler();

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

    this.addEvents_();

    window.requestAnimationFrame(() => {
      document.body.removeAttribute('unresolved');
    });
  }

  /**
   * @export
   * @override
   */
  disconnectedCallback() {
    this.eventHandler_.removeAll();
  }

  /**
   * @return {!Array<string>}
   * @export
   */
  static get observedAttributes() {
    return [];
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
    console.log(attr);
  }

  /**
   * @private
   */
  addEvents_() {
    console.log('moo');
  }

  /**
   * @private
   */
  setupDom_() {
    const mainInner = this.querySelector('main .main-inner');
    const list = this.querySelector('main ul');
    const cards = dom.createElement('cards');
    const categories = [];
    if (list) {
      [...list.querySelectorAll('a')].forEach((link) => {
        const category = link.getAttribute(CATEGORY_ATTR);
        const info = {
          category: category,
          title: link.getAttribute(TITLE_ATTR),
          duration: link.getAttribute(DURATION_ATTR),
          updated: link.getAttribute(UPDATED_ATTR),
          tags: link.getAttribute(TAGS_ATTR)
        };
        soy.renderElement(link, Templates.card, info);
        link.classList.add('card');
        dom.appendChild(cards, link);
        categories.push(category);
      });
      dom.removeNode(list);
    }

    const sortBy = soy.renderAsElement(Templates.sortby);
    sortBy.setAttribute('id', 'sort-by');

    dom.appendChild(mainInner, sortBy);
    dom.appendChild(mainInner, cards);
    this.hasSetup_ = true;
  }
}

window.customElements.define('google-codelabs', Codelabs);

exports = Codelabs;