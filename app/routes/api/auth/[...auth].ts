import { createRoute } from 'honox/factory'
import { getAuth } from '../../../../src/lib/auth/client'

export const GET = createRoute((c) => {
  const auth = getAuth(c.env)
  return auth.handler(c.req.raw)
})

export const POST = createRoute((c) => {
  const auth = getAuth(c.env)
  return auth.handler(c.req.raw)
})
