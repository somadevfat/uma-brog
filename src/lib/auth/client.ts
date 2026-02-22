import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createDb } from '../../db/client'

// Use a local interface to match Hono's Env or import it
interface Env {
  DB: D1Database
}

export const getAuth = (env: Env) => {
  const db = createDb(env.DB)
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    emailAndPassword: {
      enabled: true,
    },
  })
}
