
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import ProjectCard from "../ProjectCard";
import Modal from "../Modal";
import Reveal from "../Reveal";
import SectionTitle from "../SectionTitle";

export default function ProjectsSection({ projects = [] }) {
    const [filter, setFilter] = useState("All");
    const [selected, setSelected] = useState(null);

    const categories = [
        "All",
        ...new Set(
            projects.map((project) => project.category).filter(Boolean)
        ),
    ];

    const visibleProjects =
        filter === "All"
            ? projects
            : projects.filter(
                (project) => project.category === filter
            );

    return (
        <section
            id="projects"
            className="theme-section section-spacing px-6"
        >
            <div className="mx-auto max-w-6xl">

                <Reveal>
                    <SectionTitle
                        eyebrow="03 / SELECTED WORK"
                        title="Featured"
                        accent="projects"
                    />
                </Reveal>

                {/* Project filters */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setFilter(category)}
                            className={`project-filter rounded-full px-3.5 py-2 text-xs font-medium transition ${filter === category ? "active" : ""
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Project grid */}
                <div className="grid gap-5 md:grid-cols-2">
                    {visibleProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onOpen={setSelected}
                        />
                    ))}
                </div>

                {!visibleProjects.length && (
                    <p className="theme-muted text-sm">
                        No projects in this category yet. Add projects from
                        the admin dashboard.
                    </p>
                )}

                <AnimatePresence>
                    {selected && (
                        <Modal
                            project={selected}
                            onClose={() => setSelected(null)}
                        />
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
