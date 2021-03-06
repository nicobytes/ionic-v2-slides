describe('tabs/advanced: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/tabs/advanced/index.html?ionicplatform=ios&ionicanimate=false&snapshot=true');
});

'use strict';

it('should go to Tab1 Page1', function () {
    element(by.css('#signIn')).click();
});
it('should go to Tab1 Page2', function () {
    element(by.css('#goToTab1Page2')).click();
});
it('should go back to Tab1 Page1', function () {
    element(by.css('#backToTab1Page1')).click();
});
it('should go to Tab2 Page1', function () {
    element(by.css('.tab-button:nth-of-type(2)')).click();
});
it('should go back to Tab1 Page1', function () {
    element(by.css('.tab-button:nth-of-type(1)')).click();
});

});
