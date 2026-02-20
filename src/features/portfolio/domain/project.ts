export type Project = {
  id: string
  title: string
  description: string
  imageUrl: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  date: string
}

export interface IPortfolioRepository {
  findAll(): Promise<Project[]>
}
