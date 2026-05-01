import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static'
import { readFile } from 'fs/promises'
const app = new Hono()

// NOTE: Actual Webapp

app.get('/', serveStat,
  getContent: async (path, c) => c.html(await readFile(path, 'utf8'))ic({
  path: './index.html'
}))

export default app

// NOTE: TESTS

// // Basic GET route
// app.get('/hello', (c) => {
//   return c.text('Hello Hono!')
// })

// // Route with a path parameter
// app.get('/user/:id', (c) => {
//   const id = c.req.param('id')
//   return c.json({ userId: id })
// })