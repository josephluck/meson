import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./dist/tests/apps/component-lifecycle-mount.js')
    done()
  },

  'Calls onBeforeMount Before A Component Renders'(browser: NightwatchBrowser) {
    // For this one, we could compare Date.now() between hook and render to determine ordering
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.execute(function () {
      return window['counts'].onBeforeMount
    }, [], (result) => {
      browser.assert.equal(result.value, 1)
    })

    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  }
}
