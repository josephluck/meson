import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./dist/tests/apps/stateful-counters.js')
    done()
  },

  'Renders Two Counters'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.expect.element('#count-one')
      .text.to.contain('0')
      .before(2000)
    browser.expect.element('#count-two')
      .text.to.contain('0')
      .before(2000)
    browser.expect.element('#count-three')
      .text.to.contain('0')
      .before(2000)
    browser.expect.element('#render-count-counter-one')
      .text.to.equal('1')
    browser.expect.element('#render-count-counter-two')
      .text.to.equal('1')
    browser.expect.element('#render-count-counter-three')
      .text.to.equal('1')
    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  }
}
