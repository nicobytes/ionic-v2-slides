describe('action-sheet/basic: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/action-sheet/basic/index.html?ionicplatform=android&ionicanimate=false&snapshot=true');
});

'use strict';

it('should open action sheet', function () {
    element(by.css('.e2eOpenActionSheet')).click();
});
it('should close with backdrop click', function () {
    element(by.css('backdrop')).click();
});

});
