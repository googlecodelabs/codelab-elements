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

goog.module('googlecodelabs.CodelabIndex.Cards');

const Templates = goog.require('googlecodelabs.CodelabIndex.Templates');
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

/** @const {string} */
const SORT_ATTR = 'sort';

/** @const {string} */
const FILTER_ATTR = 'filter';

/** @const {string} */
const CATEGORIES_ATTR = 'categories';

/** @const {string} */
const SORT_ALPHA = 'alpha';

/** @const {string} */
const SORT_RECENT = 'recent';

/** @const {string} */
const SORT_DURATION = 'duration';

/**
 * @extends {HTMLElement}
 */
class Cards extends HTMLElement {
  /**
   * @export
   * @override
   */
  connectedCallback() {
    if (!this.hasAttribute(SORT_ATTR)) {
      this.setAttribute(SORT_ATTR, SORT_ALPHA);
    } else {
      this.sort_();
    }
  }

  /**
   * @return {!Array<string>}
   * @export
   */
  static get observedAttributes() {
    return [SORT_ATTR, FILTER_ATTR, CATEGORIES_ATTR];
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
    if (attr === SORT_ATTR) {
      this.sort_();
    } else if (attr === FILTER_ATTR) {
      this.filter_();
    }
  }

  /**
   * @private
   */
  sort_() {
    const sort = this.getAttribute(SORT_ATTR);
    const cards = [...this.querySelectorAll('.card')];
    switch (sort) {
      case SORT_DURATION:
        cards.sort(this.sortDuration_);
        break;
      case SORT_RECENT:
        cards.sort(this.sortRecent_);
        break;
      case SORT_ALPHA:
      default:
        cards.sort(this.sortAlpha_);
        break;
    }

    cards.forEach((card) => this.appendChild(card));
  }

  /**
   * @param {!Element} a
   * @param {!Element} b
   * @return {number}
   * @private
   */
  sortDuration_(a, b) {
    const aDuration = parseFloat(a.getAttribute(DURATION_ATTR)) || 0;
    const bDuration = parseFloat(b.getAttribute(DURATION_ATTR)) || 0;

    return aDuration - bDuration;
  }

  /**
   * @param {!Element} a
   * @param {!Element} b
   * @return {number}
   * @private
   */
  sortRecent_(a, b) {
    const aUpdated = new Date(a.getAttribute(UPDATED_ATTR) || 0);
    const bUpdated = new Date(b.getAttribute(UPDATED_ATTR) || 0);
    return bUpdated - aUpdated;
  }

  /**
   * @param {!Element} a
   * @param {!Element} b
   * @return {number}
   * @private
   */
  sortAlpha_(a, b) {
    const aTitle = a.getAttribute(TITLE_ATTR);
    const bTitle = b.getAttribute(TITLE_ATTR);
    if (aTitle < bTitle) {
      return -1;
    } else if (aTitle > bTitle) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * @private
   */
  filter_() {
    console.log('filter');
  }

  /**
   * 
   * @param {string} category 
   * @returns {string}
   */
  normalizeCategory_(category) {
    return category.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/--+/g, '-')         // Replace multiple - with single -
        .trim().split(',').shift();
  }

  /**
   * @param {!Element} link
   * @export
   */
  addCard(link) {
    const info = {
      category: this.normalizeCategory_(link.getAttribute(CATEGORY_ATTR) || ''),
      title: link.getAttribute(TITLE_ATTR) || '',
      duration: parseInt(link.getAttribute(DURATION_ATTR), 10) || 0,
      updated: this.prettyDate_(link.getAttribute(UPDATED_ATTR)) || '',
      tags: link.getAttribute(TAGS_ATTR) || ''
    };
    soy.renderElement(link, Templates.card, info);
    link.classList.add('card');
    this.appendChild(link);
  }

  /**
   * 
   * @param {string} updated 
   * @returns {string}
   */
  prettyDate_(updated) {
    if (!updated) {
      return '';
    }
    const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(updated);
    return mNames[d.getMonth()] + ' ' + d.getUTCDate() + ', ' + d.getFullYear();
  };
}

window.customElements.define('google-codelab-index-cards', Cards);

exports = Cards;