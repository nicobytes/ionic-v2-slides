describe('menu/basic: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/menu/basic/index.html?ionicplatform=android&ionicanimate=false&snapshot=true');
});

'use strict';

it('should toggle open menu', function () {
    element(by.css('.e2eContentToggleMenu')).click();
});
it('should close menu', function () {
    element(by.css('[menu-close=leftMenu]')).click();
});

});
