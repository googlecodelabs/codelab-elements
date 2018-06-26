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

goog.module('googlecodelabs.CodelabAnalytics');

const EventHandler = goog.require('goog.events.EventHandler');

/**
 * The general codelab action event fired for trackable interactions.
 */
const ACTION_EVENT = 'google-codelab-action';

/**
 * The general codelab pageview event fired for trackable pageviews.
 */
const PAGEVIEW_EVENT = 'google-codelab-pageview';

/**
 * The Google Analytics ID. Analytics CE will not complete initialization
 * without a valid Analytics ID value set for this.
 * @const {string}
 */
const GAID_ATTR = 'gaid';

/**
 * The GAID defined by the current codelab.
 * @const {string}
 */
const CODELAB_GAID_ATTR = 'codelab-gaid';

/** @const {string} */
const CODELAB_ENV_ATTR = 'environment';

/** @const {string} */
const CODELAB_CATEGORY_ATTR = 'category';


/**
 * Event detail passed when firing GOOGLE_CODELAB_ACTION_EVENT.
 *
 * @typedef {{
 *  category: string,
 *  action: string,
 *  label: (?string|undefined),
 *  value: (?number|undefined)
 * }}
 */
let AnalyticsTrackingEvent;


/**
 * @extends {HTMLElement}
 * @suppress {reportUnknownTypes}
 */
class CodelabAnalytics extends HTMLElement {
  constructor() {
    super();

    /** @private {boolean} */
    this.hasSetup_ = false;

    /** @private {?string} */
    this.gaid_ = this.getAttribute(GAID_ATTR) || '';

    /** @private {!EventHandler} */
    this.eventHandler_ = new EventHandler();

    /** @private {!EventHandler} */
    this.pageviewEventHandler_ = new EventHandler();

    /** @private {?string} */
    this.codelabCategory_ = this.getAttribute(CODELAB_CATEGORY_ATTR) || '';

    /** @private {?string} */
    this.codelabEnv_ = this.getAttribute(CODELAB_ENV_ATTR) || '';
  }

  /**
   * @export
   * @override
   */
  connectedCallback() {
    if (this.hasSetup_ || !this.gaid_) {
      return;
    }

    this.hasSetup_ = true;
    this.initGAScript_();
    this.trackPageView_();
    this.addEventListeners_();
  }

  addEventListeners_() {
    this.eventHandler_.listen(document.body, ACTION_EVENT,
      (e) => {
        const detail = /** @type {AnalyticsTrackingEvent} */ (
          e.getBrowserEvent().detail);
        // Add tracking...
        this.trackEvent_(
          detail.category, detail.action, detail.label, detail.value);
      });

    this.pageviewEventHandler_.listen(document.body, PAGEVIEW_EVENT,
      (e) => {
        const detail = e.getBrowserEvent().detail;
        this.trackPageView_(detail.page, detail.title);
      });
  }

  /**
   * @return {!Array<string>}
   * @export
   */
  static get observedAttributes() {
    return [CODELAB_GAID_ATTR, CODELAB_ENV_ATTR, CODELAB_CATEGORY_ATTR];
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
      case CODELAB_GAID_ATTR:
        if (newValue) {
          this.createCodelabGATracker_(newValue);
        }
        break;
      case CODELAB_ENV_ATTR:
        this.codelabEnv_ = newValue;
        break;
      case CODELAB_CATEGORY_ATTR:
        this.codelabCategory_ = newValue;
        break;
    }
  }

  /**
   * Fires an analytics tracking event to all configured trackers.
   *
   * @param {string} category The event category.
   * @param {string=} opt_action The event action.
   * @param {?string=} opt_label The event label.
   * @param {?number=} opt_value The event value.
   * @export
   */
  trackEvent_(category, opt_action, opt_label, opt_value) {
    const params = {
      // Always event for trackEvent_ method
      'hitType': 'event',
      'dimension1': this.codelabEnv_,
      'dimension2': this.codelabCategory_,
      'eventCategory': category,
      'eventAction': opt_action || '',
      'eventLabel': opt_label || '',
      'eventValue': opt_value || '',
    };
    console.log('event params: ', params);
    this.gaSend_(params);
  }

  /**
   * @param {?string=} opt_page The page to track.
   * @param {?string=} opt_title The codelabs title.
   */
  trackPageView_(opt_page, opt_title) {
    const params = {
      'hitType': 'pageview',
      'dimension1': this.codelabEnv_,
      'dimension2': this.codelabCategory_,
      'page': opt_page || '',
      'title': opt_title || ''
    };
    console.log('pageview params: ', params);
    this.gaSend_(params);
  }

  gaSend_(params) {
    window['ga'](function() {
      const trackers = window['ga'].getAll();
      trackers.forEach((tracker) => {
        tracker.send(params);
      });
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
   * Creates a GA tracker.
   * @param {string} codelabGAId A GAID for an account.
   */
  createCodelabGATracker_(codelabGAId) {
    // Make sure sure that tracker gets created only once per session.
    // Also makes sure the script wasn't already included in the html.
    if (!goog.isDef(window['ga'])) {
      this.initGAScript_();
    }

    if (!window['ga']['getByName']('codelabAccount')) {
      window['ga']('create', codelabGAId, 'auto', 'codelabAccount');
    }
  }

  getGAView_() {
    let parts = location.search.substring(1).split('&');
    for (let i = 0; i < parts.length; i++) {
      let param = parts[i].split('=');
      if (param[0] === 'viewga') {
        return param[1];
      }
    }
    return '';
  }

  initGAScript_() {
    // Make sure sure that tracker gets created only once per session.
    // Also makes sure the script wasn't already included in the html.
    if (goog.isDef(window['ga'])) {
      return;
    }

    // This is a pretty-printed version of the function(i,s,o,g,r,a,m) script
    // provided by Google Analytics.
    window['GoogleAnalyticsObject'] = 'ga';
    window['ga'] = window['ga'] || function() {
      (window['ga']['q'] = window['ga']['q'] || []).push(arguments);
    };
    window['ga']['l'] = (new Date()).valueOf();

    if (this.gaid_) {
      window['ga']('create', this.gaid_, 'auto');
    }

    const gaView = this.getGAView_();
    if (gaView) {
      window['ga']('create', gaView, 'auto', {name: 'view'});
      window['ga']('view.send', 'pageview');
    }
  }
}

window.customElements.define('google-codelab-analytics', CodelabAnalytics);

exports = CodelabAnalytics;
