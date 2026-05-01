import { Hono } from 'hono'
import { db } from '@/db/db.js'
import { users, magicLinkTokens } from '@/db/schema.js'
import { eq } from 'drizzle-orm'
import { randomBytes } from 'crypto'

const app = new Hono()

app.post('/signin', async (c) => {
  const { email } = await c.req.parseBody()
  if (typeof email !== 'string') return c.text('Invalid input', 400)

  // Find or create user
  let user = await db.query.users.findFirst({
    where: eq(users.email, email)
  })
  if (!user) {
    [user] = await db.insert(users).values({ email }).returning()
  }

  // Generate token
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 min

  await db.insert(magicLinkTokens).values({
    userId: user.id,
    token,
    expiresAt,
  })

  const link = `${process.env.BASE_URL}/auth/verify?token=${token}`
  // TODO: send email with `link` (e.g. via Resend, Nodemailer)
  console.log('Magic link:', link)

  return c.text('Check your email!')
})

app.get('/auth/verify', async (c) => {
  const token = c.req.query('token')
  if (!token) return c.text('Missing token', 400)

  const record = await db.query.magicLinkTokens.findFirst({
    where: eq(magicLinkTokens.token, token),
    with: { user: true }
  })

  if (!record || record.used || record.expiresAt < new Date()) {
    return c.text('Invalid or expired link', 400)
  }

  // Mark token as used
  await db.update(magicLinkTokens)
    .set({ used: true })
    .where(eq(magicLinkTokens.token, token))

  // TODO: set a session cookie (e.g. using hono/cookie + a sessions table)
  return c.text(`Logged in as ${record.user.email}`)
})