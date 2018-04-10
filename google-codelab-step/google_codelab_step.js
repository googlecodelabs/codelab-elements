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

goog.module('googlecodelabs.CodelabStep');

const dom = goog.require('goog.dom');

/**
 * @extends {HTMLElement}
 */
class CodelabStep extends HTMLElement {
  constructor() {
    super();

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
  }

  /**
   * @private
   */
  setupDom_() {
    //const instructions = dom.createElement('div');
    let inner = document.createElement('div'); //dom.createElement('div');
    dom.removeChildren(this);

    /*const children = dom.getChildren(this);
    children.forEach((c) => {
      dom.appendChild(inner, (c));
    });*/

    //console.log( this.instructions_);
    console.log(inner);

    //dom.appendChild(this.instructions_, this.inner_);
    //dom.appendChild(this, this.instructions_);

    this.hasSetup_ = true;
    console.log('miii');
  }
}

window.customElements.define('google-codelab-step', CodelabStep);

exports = CodelabStep;
