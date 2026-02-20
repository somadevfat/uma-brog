import { Project } from '../domain/project'

export const ProjectGrid = ({ projects }: { projects: Project[] }) => {
  return (
    <div class="grid grid-cols-1 gap-12">
      {projects.map((project) => (
        <div key={project.id} class="blueprint-border p-0 overflow-hidden flex flex-col md:flex-row gap-0 group">
          <div class="w-full md:w-1/2 aspect-video bg-[#0D0D0D] p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-border-line relative">
            <div class="absolute top-2 left-2 mono text-[10px] text-secondary">PROJECT_VISUAL / REV-A</div>
            <img src={project.imageUrl} alt={project.title} class="max-w-full max-h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
            <div class="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
          </div>
          
          <div class="p-8 flex flex-col justify-center flex-grow">
            <div class="mono text-[10px] text-accent-red mb-2 tracking-widest uppercase">BLUEPRINT_IDENTIFIED / {project.date}</div>
            <h3 class="text-2xl font-thin tracking-widest mb-4 group-hover:text-accent-red transition-colors mono">{project.title}</h3>
            <p class="text-sm text-secondary mb-6">{project.description}</p>
            
            <div class="flex flex-wrap gap-2 mb-8">
              {project.techStack.map(tech => (
                <span key={tech} class="mono text-[10px] px-2 py-1 border border-border-line text-secondary">{tech}</span>
              ))}
            </div>
            
            <div class="flex gap-4">
              {project.githubUrl && <a href={project.githubUrl} target="_blank" class="btn-blueprint text-xs">SOURCE_CODE</a>}
              {project.liveUrl && <a href={project.liveUrl} target="_blank" class="btn-blueprint text-xs">LIVE_ACCESS</a>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
