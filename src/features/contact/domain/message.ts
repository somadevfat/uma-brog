export type Message = {
  id: string
  senderName: string
  senderEmail: string
  subject: string
  body: string
  createdAt: Date
}

export interface IContactRepository {
  save(message: Message): Promise<void>
}
