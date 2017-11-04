import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./dist/tests/apps/counter.js')
    done()
  },

  'Renders Counter Initial State'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.expect.element('body')
      .text.to.contain('Increment')
      .before(2000)
    browser.expect.element('body')
      .text.to.contain('Decrement')
      .before(2000)
    browser.expect.element('#count')
      .text.to.equal('0')
      .before(2000)
    browser.expect.element('#render-count')
      .text.to.equal('1')
    browser.end()
  },

  'Updates Count When Increment Is Pressed'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
    browser.expect.element('#count')
      .text.to.equal('1')
      .before(2000)
    browser.expect.element('#render-count')
      .text.to.equal('2')
    browser.end()
  },

  'Updates Count When Decrement Is Pressed'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
      .click('#decrement-button')
      .click('#decrement-button')
    browser.expect.element('#count')
      .text.to.equal('-1')
      .before(2000)
    browser.expect.element('#render-count')
      .text.to.equal('4')
    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  }
}
