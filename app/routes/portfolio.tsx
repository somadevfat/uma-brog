import { createRoute } from 'honox/factory'
import { PortfolioRepository } from '../../src/features/portfolio/infrastructure/portfolio-repository'
import { ProjectGrid } from '../../src/features/portfolio/presentation/project-grid'

export default createRoute(async (c) => {
  const repo = new PortfolioRepository()
  const projects = await repo.findAll()

  return c.render(
    <div class="py-12">
      <header class="mb-12">
        <h2 class="section-title">PROJECT_BLUEPRINTS</h2>
        <p class="text-sub font-xs mono mt-4">Detailed technical specifications and implementation results.</p>
      </header>

      <ProjectGrid projects={projects} />
    </div>
  )
})
