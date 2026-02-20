import { Message, IContactRepository } from '../domain/message'

export type SendMessageInput = {
  senderName: string
  senderEmail: string
  subject: string
  body: string
}

export class SendMessageUseCase {
  constructor(private contactRepository: IContactRepository) {}

  async execute(input: SendMessageInput): Promise<void> {
    const message: Message = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: new Date(),
    }
    await this.contactRepository.save(message)
  }
}
