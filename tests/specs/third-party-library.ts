import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./dist/tests/apps/third-party-library.js')
    done()
  },

  'Renders A Third Party Library Instead Of The Component'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.expect.element('#3rd-party-library').to.be.present
    browser.end()
  },

  'Persists The 3rd Party Library When The Component Is Rendered From The Outside'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
    browser.expect.element('#3rd-party-library').to.be.present
    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  }
}
