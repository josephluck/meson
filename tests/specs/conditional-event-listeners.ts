import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./dist/tests/apps/conditional-event-listeners.js')
    done()
  },

  'Adds The Event Listener When The Condition Is Met'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
    browser.expect.element('#count')
      .text.to.contain('1')
      .before(2000)

    browser.end()
  },
  'Removes The Event Listener When The Condition Is Not Met'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
      .click('#increment-button')
    browser.expect.element('#count')
      .text.to.contain('1')
      .before(2000)

    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  }
}
