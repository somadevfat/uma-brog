import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../src/db/schema'

const app = createApp()

app.use('*', async (c, next) => {
  if (c.env.DB) {
    const db = drizzle(c.env.DB, { schema })
    c.set('db', db)
  }
  await next()
})

showRoutes(app)

export default app
