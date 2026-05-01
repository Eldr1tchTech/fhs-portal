import { Hono } from 'hono'
import { readFile } from 'fs/promises'

const app = new Hono()

app.get('/', async (c) => {
  const html = await readFile('./public/index.html', 'utf8')
  return c.html(html)
})

app.post('/signin', async (c) => {
  const { email, password } = await c.req.parseBody()

  // TODO: Use zod instead...
  // Ensure they're strings (parseBody can return File objects)
  if (typeof email !== 'string' || typeof password !== 'string') {
    return c.text('Invalid input', 400)
  }

  // Email format check
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailValid) {
    return c.text('Invalid email', 400)
  }

  // Password requirements
  if (password.length < 8) {
    return c.text('Password must be at least 8 characters', 400)
  }

  // ... proceed to DB lookup
  console.log("Proceeding to db lookup...")
  return c.text('OK')
})

export default app