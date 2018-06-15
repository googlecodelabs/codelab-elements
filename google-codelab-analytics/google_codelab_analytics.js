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
const GOOGLE_CODELAB_ACTION_EVENT = 'google-codelab-action';

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

    this.hasSetup_ = false;

    /** @private {!EventHandler} */
    this.eventHandler_ = new EventHandler();
  }

  connectedCallback() {
    if (this.hasSetup_) {
      return;
    }

    this.hasSetup_ = true;
    this.addEventListeners_();
  }

  addEventListeners_() {
    this.eventHandler_.listen(document.body, GOOGLE_CODELAB_ACTION_EVENT,
      (e) => {
        const detail = /** @type {AnalyticsTrackingEvent} */ (
          e.getBrowserEvent().detail);
        // Add tracking...
        console.log(detail);
      });
  }

  disconnectedCallback() {
    this.eventHandler_.removeAll();
  }
}

window.customElements.define('google-codelab-analytics', CodelabAnalytics);

exports = CodelabAnalytics;
