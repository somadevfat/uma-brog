import { IPostRepository, Post } from '../domain/post'

export class GetPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(): Promise<Post[]> {
    return this.postRepository.findAll()
  }
}

export class GetPostBySlugUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(slug: string): Promise<Post | undefined> {
    return this.postRepository.findBySlug(slug)
  }
}
