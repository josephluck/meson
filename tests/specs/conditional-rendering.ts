import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./dist/tests/apps/conditional-rendering.js')
    done()
  },

  'Doesnt Render The Conditional Element'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.expect.element('#count')
      .text.to.contain('0')
    browser.expect.element('#conditional-element')
      .to.not.be.present
    browser.expect.element('#should-persist-this-element')
      .to.be.present
    browser.end()
  },
  'Renders The Conditional Element When The Condition Is Met'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
    browser.expect.element('#count')
      .text.to.contain('1')
    browser.expect.element('#conditional-element')
      .to.be.present
    browser.expect.element('#conditional-element')
      .text.to.be.equal('Boo!')
    browser.expect.element('#should-persist-this-element')
      .to.be.present
    browser.end()
  },
  'Doesnt Render The Conditional Component'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.expect.element('#count')
      .text.to.contain('0')
    browser.expect.element('#conditional-component')
      .to.not.be.present
    browser.expect.element('#should-persist-this-element')
      .to.be.present
    browser.end()
  },
  'Renders The Conditional Component When The Condition Is Met'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
      .click('#increment-button')
    browser.expect.element('#count')
      .text.to.contain('2')
    browser.expect.element('#conditional-component')
      .to.be.present
    browser.expect.element('#conditional-component')
      .text.to.contain('Ahh!')
    browser.expect.element('#should-persist-this-element')
      .to.be.present
    browser.end()
  },
  'Persists Other Elements When Conditional Elements / Components Are Rendered'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
      .click('#increment-button')
      .click('#increment-button')
    browser.expect.element('#count')
      .text.to.contain('3')
    browser.expect.element('#conditional-component')
      .to.be.present
    browser.expect.element('#conditional-component')
      .text.to.contain('Ahh!')
    browser.expect.element('#should-persist-this-element')
      .to.be.present
    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  }
}
