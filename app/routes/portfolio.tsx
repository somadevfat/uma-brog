import { createRoute } from 'honox/factory'
import { PortfolioRepository } from '../../src/features/portfolio/infrastructure/portfolio-repository'
import { ProjectGrid } from '../../src/features/portfolio/presentation/project-grid'

export default createRoute(async (c) => {
  const repo = new PortfolioRepository()
  const projects = await repo.findAll()

  return c.render(
    <div class="px-6 py-12 max-w-6xl mx-auto">
      <header class="mb-16">
        <h1 class="text-4xl font-thin mb-2 tracking-widest uppercase">PROJECT_BLUEPRINTS</h1>
        <div class="h-1 bg-accent-red w-24"></div>
        <p class="text-secondary mono text-sm mt-4">Detailed technical specifications and implementation results.</p>
      </header>

      <ProjectGrid projects={projects} />
    </div>
  )
})
