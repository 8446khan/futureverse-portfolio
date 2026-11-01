
import { X, ExternalLink, Github } from "lucide-react";

export default function Modal({ project, onClose }) {
    if (!project) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
                className="glass my-auto w-full max-w-lg rounded-2xl p-5 sm:p-6"
            >

                {/* Header */}
                <div className="flex items-center justify-between">

                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                        {project.category || "Project"}
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close project details"
                        className="rounded-full p-2 transition hover:bg-white/10"
                    >
                        <X size={19} />
                    </button>

                </div>

                {/* Project title */}
                <h2
                    id="project-modal-title"
                    className="mt-3 text-2xl font-bold sm:text-3xl"
                >
                    {project.title}
                </h2>

                {/* Description */}
                <p className="mt-4 text-sm leading-7 text-slate-300">
                    {project.description}
                </p>

                {/* Technologies */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {(project.technologies || []).map((technology) => (
                        <span
                            key={technology}
                            className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-slate-300"
                        >
                            {technology}
                        </span>
                    ))}
                </div>

                {/* Project links */}
                <div className="mt-6 flex flex-wrap gap-3">

                    {project.github_url && (
                        <a
                            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm transition hover:bg-white/20"
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github size={16} />
                            GitHub
                        </a>
                    )}

                    {project.demo_url && (
                        <a
                            className="flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm transition hover:bg-violet-700"
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Live demo
                            <ExternalLink size={15} />
                        </a>
                    )}

                </div>

            </div>
        </div>
    );
}
