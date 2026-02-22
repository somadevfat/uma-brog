import { createRoute } from 'honox/factory'
import { AdminDashboard } from '../../../src/features/admin/admin-dashboard'
import { contactService } from '../../../src/features/contact/services'

export default createRoute(async (c) => {
  const db = c.var.db
  if (!db) {
    return c.notFound()
  }

  const allMessages = await contactService.getAllMessages(db)

  return c.render(<AdminDashboard messages={allMessages} />)
})
