import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./dist/tests/apps/component-should-render.js')
    done()
  },

  'Doesnt Render The Component'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.expect.element('#count')
      .text.to.contain('0')
      .before(2000)
    browser.expect.element('#render-count')
      .text.to.equal('1')
    browser.expect.element('#conditional-component')
      .to.not.be.present

    browser.end()
  },
  'Renders The Component When The shouldRender Condition Is Truthy'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
    browser.expect.element('#count')
      .text.to.contain('1')
      .before(2000)
    browser.expect.element('#render-count')
      .text.to.equal('2')
    browser.expect.element('#conditional-component')
      .to.be.present
    browser.expect.element('#component-render-count')
      .text.to.equal('1')
    browser.expect.element('#conditional-component')
      .text.to.contain('Ahh!')

    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  }
}
