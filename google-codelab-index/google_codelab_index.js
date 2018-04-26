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

const Cards = goog.require('googlecodelabs.Codelabs.Cards');
const EventHandler = goog.require('goog.events.EventHandler');
const Templates = goog.require('googlecodelabs.Codelabs.Templates');
const dom = goog.require('goog.dom');
const events = goog.require('goog.events');
const soy = goog.require('goog.soy');

/** @const {string} */
const CATEGORY_ATTR = 'category';

/** @const {string} */
const SORT_ATTR = 'sort';

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

    /** @private {?Cards} */
    this.cards_ = null;

    /** @private {?Element} */
    this.sortBy_ = null;
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
   * @private
   */
  addEvents_() {
    if (this.sortBy_) {
      this.eventHandler_.listen(this.sortBy_, events.EventType.CLICK,
        (e) => {
          e.preventDefault();
          this.handleSortByClick_(e);
        });
    }
  }

  /**
   * @param {!Event} e
   * @private
   */
  handleSortByClick_(e) {
    const target = /** @type {!Element} */ (e.target);
    const sort = target.getAttribute(SORT_ATTR);
    if (this.cards_) {
      this.cards_.setAttribute(SORT_ATTR, sort);
    }
    const selected = this.querySelector('[selected]');
    if (selected) {
      selected.removeAttribute('selected');
    }
    target.setAttribute('selected', '');
  }

  /**
   * @private
   */
  setupDom_() {
    const mainInner = this.querySelector('main .main-inner');
    if (!mainInner) {
      return;
    }
    
    const list = this.querySelector('main ul');
    let cards = new Cards();
    const categories = [];
    if (list) {
      [...list.querySelectorAll('a')].forEach((link) => {
        cards.addCard(link);
      });
      dom.removeNode(list);
      dom.appendChild(mainInner, cards);
    } else {
      cards = mainInner.querySelector('google-codelabs-cards');
    }

    if (cards) {
      [...cards.querySelectorAll('.card')].forEach((card) => {
        const category = card.getAttribute(CATEGORY_ATTR);
        if (category) {
          categories.push(category);
        }
      });
      const sortBy = soy.renderAsElement(Templates.sortby);
      sortBy.setAttribute('id', 'sort-by');
      dom.insertSiblingBefore(sortBy, cards);

      this.sortBy_ = sortBy;
      this.cards_ = /** @type {!Cards} */ (cards);
    }

    this.hasSetup_ = true;
  }
}

window.customElements.define('google-codelabs', Codelabs);

exports = Codelabs;