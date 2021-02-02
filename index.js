import jobs from './jobs'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/job')) return jobs(request)
  return fetch(request)
}
