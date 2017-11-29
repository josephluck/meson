import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./dist/tests/apps/hello-world.js')
    done()
  },
  'Renders Hello World': async (browser: NightwatchBrowser) => {
    console.log(server.domain)
    browser.url(server.domain).waitForElementVisible('body', 2000)

    browser.expect
      .element('body')
      .text.to.contain('Hello World')
      .before(2000)

    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  },
}
