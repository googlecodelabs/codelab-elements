goog.module('googlecodelabs.CodelabDef');
const Codelab = goog.require('googlecodelabs.Codelab');

console.log('here');
try {
  window.customElements.define(Codelab.getTagName(), Codelab);
} catch (e) {
  console.warn('googlecodelabs.Codelab', e);
}