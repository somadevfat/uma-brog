import type { Project } from './types'

export const portfolioService = {
  async getAllProjects(): Promise<Project[]> {
    return [
      {
        id: 'uma-brog',
        title: 'UMA-BROG / SYSTEM ARCHIVE',
        description:
          'Robust full-stack portfolio blog system with Retro-Future blueprint aesthetics. Built with HonoX and Cloudflare D1.',
        imageUrl: '/design/イメージ画.png',
        techStack: ['HonoX', 'Bun', 'Drizzle', 'D1', 'Better Auth'],
        githubUrl: 'https://github.com/somah/uma-brog',
        date: '2026-02-21',
      },
    ]
  },
}
