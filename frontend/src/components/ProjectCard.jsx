
import { memo } from "react";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";

function ProjectCard({ project, onOpen }) {
    return (
        <article className="glass project-card group overflow-hidden rounded-2xl transition-transform duration-200 ease-out hover:-translate-y-1">

            {/* Project Image */}
            <div className="project-image grid-bg relative flex h-36 items-center justify-center overflow-hidden">

                {project.image_url ? (
                    <img
                        src={project.image_url}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        decoding="async"
                        className="relative z-10 h-full w-full object-cover"
                    />
                ) : (
                    <div className="project-placeholder relative z-10 text-5xl">
                        ✧
                    </div>
                )}

                <span className="project-category absolute right-3 top-3 z-20 rounded-full px-2.5 py-1 text-[10px]">
                    {project.category || "Project"}
                </span>
            </div>

            {/* Project Information */}
            <div className="p-4">

                <h3 className="text-lg font-bold">
                    {project.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                    {project.description}
                </p>

                {/* Technologies */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {(project.technologies || []).slice(0, 4).map((technology) => (
                        <span
                            key={technology}
                            className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] text-cyan-300"
                        >
                            {technology}
                        </span>
                    ))}
                </div>

                {/* Project Actions */}
                <div className="mt-4 flex items-center justify-between">

                    <button
                        type="button"
                        onClick={() => onOpen(project)}
                        className="flex items-center gap-1.5 text-xs transition-colors hover:text-cyan-300"
                    >
                        Details
                        <ArrowUpRight size={14} />
                    </button>

                    <div className="flex items-center gap-3">

                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View project on GitHub"
                                className="transition-colors hover:text-cyan-300"
                            >
                                <Github size={15} />
                            </a>
                        )}

                        {project.demo_url && (
                            <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open live project demo"
                                className="transition-colors hover:text-cyan-300"
                            >
                                <ExternalLink size={15} />
                            </a>
                        )}

                    </div>
                </div>
            </div>
        </article>
    );
}

export default memo(ProjectCard);
