import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./dist/tests/apps/component-lifecycle-simple.js')
    done()
  },

  'Calls onBeforeMount Before A Component Renders'(browser: NightwatchBrowser) {
    browser.url(server.domain).waitForElementVisible('body', 2000)
    browser.execute(() => window['counts'], [], result => {
      browser.assert.equal(result.value.onBeforeMount, 1)
    })
    browser.end()
  },

  'Calls onAfterMount After A Component Renders'(browser: NightwatchBrowser) {
    browser.url(server.domain).waitForElementVisible('body', 2000)
    browser.execute(() => window['counts'], [], result => {
      browser.assert.equal(result.value.onAfterMount, 1)
    })
    browser.end()
  },

  'Doesnt Call onBeforeMount Or onAfterMount When A Component Renders Itself'(
    browser: NightwatchBrowser,
  ) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#component-decrement-button')
    browser.execute(() => window['counts'], [], result => {
      browser.assert.equal(result.value.onBeforeMount, 1)
      browser.assert.equal(result.value.onAfterMount, 1)
    })
    browser.end()
  },

  'Doesnt Call onBeforeMount Or onAfterMount When A Component Renders From An Outside Trigger'(
    browser: NightwatchBrowser,
  ) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
    browser.execute(() => window['counts'], [], result => {
      browser.assert.equal(result.value.onBeforeMount, 1)
      browser.assert.equal(result.value.onAfterMount, 1)
    })
    browser.end()
  },

  'Doesnt Call onBeforeReplace Or onAfterReplace When A Component Renders For The First Time'(
    browser: NightwatchBrowser,
  ) {
    browser.url(server.domain).waitForElementVisible('body', 2000)
    browser.execute(() => window['counts'], [], result => {
      browser.assert.equal(result.value.onBeforeReplace, 0)
      browser.assert.equal(result.value.onAfterReplace, 0)
    })
    browser.end()
  },

  'Calls onBeforeReplace And onAfterReplace When A Component Is Given New Arguments'(
    browser: NightwatchBrowser,
  ) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
      .click('#increment-button')
    browser.execute(() => window['counts'], [], result => {
      browser.assert.equal(result.value.onBeforeReplace, 1)
      browser.assert.equal(result.value.onAfterReplace, 1)
    })
    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  },
}
