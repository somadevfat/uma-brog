import type { ErrorHandler } from 'hono'
import { ErrorPage } from '../../src/components/system/error-page'

const handler: ErrorHandler = (e, c) => {
  if ('getResponse' in e) {
    return e.getResponse()
  }
  console.error(e.message)
  return c.render(<ErrorPage message={`SYSTEM_HALT: ${e.message.toUpperCase()}`} status={500} />, {
    title: '500 INTERNAL ERROR',
  })
}

export default handler
