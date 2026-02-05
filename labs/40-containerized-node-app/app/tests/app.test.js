import test from 'node:test'
import assert from 'node:assert'
import buildApp from '../app/app.js'

test('GET / responds with a page', async () => {
  const app = buildApp()

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  assert.strictEqual(response.statusCode, 200)
  assert.match(response.headers['content-type'], /text\/html/)

  // Vérifie que le body contient quelque chose
  assert.ok(response.body.length > 0)

  // Exemple : vérifie que la page contient du HTML
  assert.match(response.body, /<html/i)
})

test('GET /unknown returns 404', async () => {
  const app = buildApp()

  const response = await app.inject({
    method: 'GET',
    url: '/unknown'
  })

  assert.strictEqual(response.statusCode, 404)
})

test('GET / responds fast enough', async () => {
  const app = buildApp()

  const start = Date.now()

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  const duration = Date.now() - start

  assert.strictEqual(response.statusCode, 200)
  assert.ok(duration < 2000) // moins de 2 secondes
})

