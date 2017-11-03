import { NightwatchBrowser } from 'nightwatch'
import budo from 'budo'
import tsify from 'tsify'

interface FrontEndServer {
  domain: string
  stop: () => any
}

function startApp(app: string): Promise<FrontEndServer> {
  return new Promise(resolve => {
    budo(app, {
      live: false,
      browserify: {
        transform: tsify
      }
    })
      .on('connect', ev => {
        console.log(ev)
        resolve({
          domain: ev.uri,
          stop: () => null
        })
      })
  })
}

export default {
  'Renders the most basic app': async (browser: NightwatchBrowser) => {
    const { domain } = await startApp('../examples/index.ts')
    browser
      .url(domain)
      .waitForElementVisible('body', 2000)

    browser.expect.element('body')
      .text.to.contain('Counter')
      .before(2000)
    browser.end()
  }
}
