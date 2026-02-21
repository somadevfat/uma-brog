import { Project } from '../domain/project'

export const ProjectGrid = ({ projects }: { projects: Project[] }) => {
  return (
    <div class="projects-grid">
      {projects.map((project) => (
        <article key={project.id} class="card">
          <div class="card-img">
            {project.imageUrl ? (
              <img src={project.imageUrl} alt={project.title} />
            ) : (
              <svg viewBox="0 0 100 50" stroke="#888" stroke-width="1" fill="none">
                <polyline points="10,40 40,15 60,30 90,10" />
                <line x1="0" y1="40" x2="100" y2="40" />
              </svg>
            )}
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div class="flex gap-2">
            {project.githubUrl && (
              <a href={project.githubUrl} class="btn" style={{ width: 'auto', paddingLeft: '10px', paddingRight: '10px' }}>
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} class="btn" style={{ width: 'auto', paddingLeft: '10px', paddingRight: '10px' }}>
                Live
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
