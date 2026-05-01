import { Hono } from 'hono'
import { readFile } from 'fs/promises'

const app = new Hono()

app.get('/', async (c) => {
  const html = await readFile('./public/index.html', 'utf8')
  return c.html(html)
})

export default app