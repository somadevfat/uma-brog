import { createRoute } from 'honox/factory'
import { portfolioService } from '../../src/features/portfolio/services'
import { ProjectGrid } from '../../src/features/portfolio/project-grid'

export default createRoute(async (c) => {
  const projects = await portfolioService.getAllProjects()

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
