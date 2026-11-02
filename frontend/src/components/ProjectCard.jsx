
import { motion } from "framer-motion";
import { ExternalLink, Github, Eye } from "lucide-react";

export default function ProjectCard({ project, onOpen }) {
    const liveUrl = project.live_url || project.liveUrl;
    const githubUrl = project.github_url || project.githubUrl;

    const projectTitle = project.title || project.name;
    const projectImage = project.image || project.image_url;

    const technologies =
        project.technologies || project.tech_stack || [];

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group overflow-hidden rounded-2xl border border-white/10
                       bg-[#111419] hover:border-[#d4a94f]/50
                       transition-all duration-300"
        >
            {/* Project Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={projectImage}
                    alt={projectTitle}
                    loading="lazy"
                    className="h-full w-full object-cover
                               transition-transform duration-500
                               group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t
                                from-[#08090b]/70 to-transparent" />
            </div>

            {/* Project Content */}
            <div className="p-6">
                <h3 className="text-xl font-semibold text-white">
                    {projectTitle}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                    {project.description}
                </p>

                {/* Technologies */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {technologies.map((technology, index) => (
                        <span
                            key={index}
                            className="rounded-full border border-white/10
                                       bg-white/5 px-3 py-1 text-xs
                                       text-[#d4a94f]"
                        >
                            {technology}
                        </span>
                    ))}
                </div>

                {/* Project Links */}
                <div className="mt-6 flex flex-wrap gap-3">

                    {/* Live Demo */}
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 rounded-lg
                                       bg-[#d4a94f] px-4 py-2.5 text-sm
                                       font-semibold text-black
                                       hover:bg-[#e5bd65] transition"
                        >
                            Live Demo
                            <ExternalLink size={16} />
                        </a>
                    )}

                    {/* GitHub */}
                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 rounded-lg
                                       border border-white/15 px-4 py-2.5
                                       text-sm font-medium text-white
                                       hover:border-[#d4a94f]
                                       hover:text-[#d4a94f] transition"
                        >
                            <Github size={16} />
                            GitHub
                        </a>
                    )}

                    {/* Project Details */}
                    {onOpen && (
                        <button
                            type="button"
                            onClick={() => onOpen(project)}
                            className="inline-flex items-center gap-2 rounded-lg
                                       border border-white/15 px-4 py-2.5
                                       text-sm font-medium text-gray-300
                                       hover:border-white/40
                                       hover:text-white transition"
                        >
                            <Eye size={16} />
                            Details
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
