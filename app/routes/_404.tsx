import type { NotFoundHandler } from 'hono'
import { ErrorPage } from '../../src/components/system/error-page'

const handler: NotFoundHandler = (c) => {
  return c.render(<ErrorPage message="SIGNAL_LOST: POSITION_UNKNOWN" status={404} />, {
    title: '404 NOT FOUND',
  })
}

export default handler
