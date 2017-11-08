import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./dist/tests/apps/component-should-replace.js')
    done()
  },

  'Doesnt Replace The Component'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
      .click('#increment-button')
    browser.expect.element('#component')
      .to.be.present
    browser.expect.element('#component-render-count')
      .text.to.equal('1')

    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  }
}
