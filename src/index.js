import jobs from './jobs'
import redirector from 'lilredirector'
import redirects from './redirects'

import Honeybadger from '@honeybadger-io/js'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  try {
    Honeybadger.configure({
      apiKey: HONEYBADGER_API_KEY,
      environment: 'production'
    })
    Honeybadger.notify('Hello from JavaScript')
  } catch (err) {
    console.log("Couldn't get Honeybadger working")
    console.log(JSON.stringify(err))
  }
  const { response } = await redirector(event, redirects)
  if (response) return response

  const url = new URL(event.request.url)
  if (url.pathname.startsWith('/job')) return jobs(event.request)
  return fetch(event.request)
}
