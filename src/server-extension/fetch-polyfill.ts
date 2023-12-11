// Needed since Squid uses Node.js v16 which doesn't have fetch
import fetch, { Headers, Request, Response } from 'node-fetch'

if (!global.fetch) {
  // @ts-ignore
  global.fetch = fetch
  // @ts-ignore
  global.Headers = Headers
  // @ts-ignore
  global.Request = Request
  // @ts-ignore
  global.Response = Response
}
