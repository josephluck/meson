import * as budo from 'budo'

export interface FrontEndServer {
  domain: string
  stop: () => any
}

export default function startApp(app: string): Promise<FrontEndServer> {
  let server
  return new Promise(resolve => {
    server = budo(app, {
      live: true,
      port: 8000,
    })
      .on('connect', ev => {
        console.log('running', ev.uri)
        resolve({
          domain: ev.uri,
          stop: server.close
        })
      })
  })
}