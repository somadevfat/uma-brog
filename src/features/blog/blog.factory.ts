import { GetPostsUseCase, GetPostBySlugUseCase } from './application/get-posts'
import { PostRepository } from './infrastructure/post-repository'

const repository = new PostRepository()

export const getPostsUseCase = new GetPostsUseCase(repository)
export const getPostBySlugUseCase = new GetPostBySlugUseCase(repository)
