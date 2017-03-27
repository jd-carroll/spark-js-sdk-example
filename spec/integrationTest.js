const env = require('./support/.env.json');
const until = protractor.until;
const EC = protractor.ExpectedConditions;
const waitTimeout = 5000;
const sparkUrl = 'localhost:8000';

describe('Search for a user', () => {

  beforeAll(() => {
    browser.get(sparkUrl);
    login();
  });

  afterAll(() => {
    logout();
  });

  it('should return an error if the user is not found', () => {

    callUserByEmail(env.fakeUser);
    waitForTextToBePresentInElementByID('calling-status', 'Fail');
    hangup();

  });

  it('should succeed in calling a valid user', () => {

    callUserByEmail(env.calleeUsername);
    waitForElementByIDToBeVisible('hangup-calling');
    hangup();

  });
});

function login() {

  clickButtonByIdOnceClickable('login-button');
  sendKeysToElementByIdWhenReady('IDToken1', env.sparkUsername);
  clickButtonByIdOnceClickable('IDButton2');
  sendKeysToElementByIdWhenReady('IDToken2', env.sparkPassword);
  clickButtonByIdOnceClickable('Button1');
  clickButtonByNameOnceClickable('accept');

}

function clickButtonByIdOnceClickable(buttonID) {
  clickButtonOnceClickable(element(By.id(buttonID)));
}

function sendKeysToElementByIdWhenReady(id, keys) {
  waitForElementByIDToBeVisible(id);
  element(By.id(id)).clear().sendKeys(keys);
}

function clickButtonByNameOnceClickable(name) {
  clickButtonOnceClickable(element(By.name(name)));
}

function clickButtonOnceClickable(button) {
  waitForElementToBeClickable(button);
  button.click();
}

function logout() {
  clickButtonByIdOnceClickable('logout-button');
}

function hangup() {
  clickButtonByIdOnceClickable('hangup-calling');
}

function callUserByEmail(email) {

  expectStalenessOfElementByID('spark-message');
  waitForElementByIDToBeClickable('logout-button');
  sendKeysToElementByIdWhenReady('user-email', email);
  clickButtonByIdOnceClickable('call-video-audio');

}

function expectStalenessOfElementByID(id) {
  expect(EC.stalenessOf(element(By.id(id))));
}

function waitForElementByIDToBeClickable(id) {
  waitForElementToBeClickable(element(By.id(id)));
}

function waitForElementToBeClickable(htmlElement) {
  browser.wait(EC.elementToBeClickable(htmlElement), waitTimeout);
}

function waitForElementByIDToBeVisible(id) {
  browser.wait(EC.visibilityOf(element(By.id(id))), waitTimeout);
}

function waitForTextToBePresentInElementByID(id, text) {
  waitForElementByIDToBeVisible(id);
  browser.wait(EC.textToBePresentInElement(element(By.id(id)), text), waitTimeout);
}
