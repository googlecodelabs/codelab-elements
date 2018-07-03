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

goog.module('googlecodelabs.CodelabAnalyticsTest');
goog.setTestOnly();

const CodelabAnalytics = goog.require('googlecodelabs.CodelabAnalytics');
const MockControl = goog.require('goog.testing.MockControl');
const dom = goog.require('goog.dom');
const testSuite = goog.require('goog.testing.testSuite');
goog.require('goog.testing.asserts');
goog.require('goog.testing.jsunit');

let mockControl;
/**
 * Noop the inject function, we don't need to be going to the actual network
 * in tests
 */
CodelabAnalytics.injectGAscript = () => {};

testSuite({

  setUp() {
    mockControl = new MockControl();
  },

  tearDown() {
    dom.removeNode(document.body.querySelector('google-codelab-analytics'));

    mockControl.$resetAll();
    mockControl.$tearDown();
  },

  testGAIDAttr_InitsTracker() {
    const mockGa = mockControl.createFunctionMock('ga');
    const analytics = new CodelabAnalytics();
    // const mockInitGA = mockControl.createMethodMock(analytics, 'initGAScript_');
    analytics.setAttribute('gaid', 'UA-123');
    // mockInitGA().$returns(Promise.resolve()).$once();
    mockGa('getAll').$returns([]).$once();
    mockGa('create', 'UA-123', 'auto').$once();
    window['ga'] = mockGa;
    mockControl.$replayAll();
    document.body.appendChild(analytics);
    mockControl.$verifyAll();
  },

  testViewParam_InitsViewTracker() {
    const mockGa = mockControl.createFunctionMock('ga');
    const analytics = new CodelabAnalytics();
    analytics.setAttribute('gaid', 'UA-123');
    const locationSearchSaved = location.search;
    location.search = '?viewga=testView&param2=hi';
    mockGa('getAll').$returns([]).$once();
    mockGa('create', 'UA-123', 'auto').$once();
    mockGa('getAll').$returns([]).$once();
    mockGa('create', 'testView', 'auto', 'view').$once();
    window['ga'] = mockGa;
    mockControl.$replayAll();

    document.body.appendChild(analytics);

    mockControl.$verifyAll();
    location.search = locationSearchSaved;
  },

  testCodelabGAIDAttr_InitsCodelabTracker() {
    const mockGa = mockControl.createFunctionMock('ga');
    const analytics = new CodelabAnalytics();
    analytics.setAttribute('gaid', 'UA-123');
    mockGa('getAll').$returns([]).$once();
    mockGa('create', 'UA-123', 'auto').$once();
    mockGa('getAll').$returns([]).$once();
    mockGa('create', 'UA-456', 'auto', 'codelabAccount').$once();
    window['ga'] = mockGa;
    mockControl.$replayAll();

    document.body.appendChild(analytics);
    analytics.setAttribute('codelab-gaid', 'UA-456');
    mockControl.$verifyAll();
  },

  testPageviewEventDispatch_SendsPageViewTracking() {

  },

  testEventDispatch_SendsEventTracking() {

  },

  testCodelabAttributes_UpdatesTrackingParams() {

  }
});
