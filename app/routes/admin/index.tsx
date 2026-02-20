import { createRoute } from 'honox/factory'
import { AdminDashboard } from '../../../src/features/admin/presentation/admin-dashboard'
import { createDb } from '../../../src/lib/db/client'
import { messages } from '../../../src/lib/db/schema'
import { desc } from 'drizzle-orm'

export default createRoute(async (c) => {
  if (!c.env.DB) {
    return c.notFound()
  }

  const db = createDb(c.env.DB)
  const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt)).all()

  return c.render(
    <AdminDashboard messages={allMessages as any[]} />
  )
})
