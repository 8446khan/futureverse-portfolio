
import { useMemo, useState } from "react";
import {
    Code2,
    Database,
    BrainCircuit,
    BarChart3,
    Layers3,
    Sparkles,
    ArrowUpRight
} from "lucide-react";

import Reveal from "../Reveal";
import SectionTitle from "../SectionTitle";

const categoryIcons = {
    Programming: Code2,
    "Web Development": Layers3,
    Database: Database,
    "Data Analytics": BarChart3,
    "Machine Learning": BrainCircuit
};

const levelWidths = {
    Beginner: "25%",
    Learning: "40%",
    Intermediate: "60%",
    Advanced: "80%",
    Expert: "100%"
};

export default function SkillsSection({ skills = [] }) {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = useMemo(() => {
        return [
            "All",
            ...new Set(
                skills.map((skill) => skill.category).filter(Boolean)
            )
        ];
    }, [skills]);

    const filteredSkills = useMemo(() => {
        if (activeCategory === "All") return skills;

        return skills.filter(
            (skill) => skill.category === activeCategory
        );
    }, [skills, activeCategory]);

    return (
        <section
            id="skills"
            className="section-muted theme-section relative overflow-hidden section-spacing px-6"
        >
            <div className="mx-auto max-w-6xl">

                {/* Heading */}
                <Reveal>
                    <SectionTitle
                        eyebrow="02 / TECH STACK"
                        title="Tools of"
                        accent="my trade"
                    />

                    <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 sm:text-base">
                        Technologies and tools I explore to build applications,
                        work with data, solve problems, and develop practical
                        solutions.
                    </p>
                </Reveal>

                {/* Category Filters */}
                {skills.length > 0 && (
                    <Reveal delay={0.1}>
                        <div className="mt-7 flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const isActive = activeCategory === category;

                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => setActiveCategory(category)}
                                        aria-pressed={isActive}
                                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${isActive
                                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-500 shadow-md shadow-cyan-500/10"
                                            : "theme-subcard border-transparent hover:border-cyan-400/30"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                );
                            })}
                        </div>
                    </Reveal>
                )}

                {/* Skills Grid */}
                {filteredSkills.length > 0 ? (
                    <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {filteredSkills.map((skill, index) => {
                            const CategoryIcon =
                                categoryIcons[skill.category] || Sparkles;

                            const level = skill.level || "Learning";

                            return (
                                <Reveal
                                    key={skill.id || skill.name}
                                    delay={index * 0.04}
                                >
                                    <article className="glass skill-card group h-full rounded-xl border border-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10">

                                        {/* Icon */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-400/20">
                                                {skill.icon ? (
                                                    skill.icon
                                                ) : (
                                                    <CategoryIcon size={21} />
                                                )}
                                            </div>

                                            <ArrowUpRight
                                                size={16}
                                                className="text-slate-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-400"
                                            />
                                        </div>

                                        {/* Skill Name */}
                                        <h3 className="mt-4 text-sm font-bold transition-colors group-hover:text-cyan-400 sm:text-base">
                                            {skill.name}
                                        </h3>

                                        {/* Category */}
                                        <p className="theme-muted mt-1 text-[10px] sm:text-xs">
                                            {skill.category || "Technology"}
                                        </p>

                                        {/* Proficiency */}
                                        <div className="mt-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-[10px] text-slate-400">
                                                    Proficiency
                                                </span>

                                                <span className="text-[10px] font-semibold text-cyan-500">
                                                    {level}
                                                </span>
                                            </div>

                                            <div
                                                className="h-1.5 overflow-hidden rounded-full bg-slate-500/15"
                                                role="progressbar"
                                                aria-label={`${skill.name} proficiency`}
                                                aria-valuetext={level}
                                            >
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-700"
                                                    style={{
                                                        width: levelWidths[level] || "40%"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </article>
                                </Reveal>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass mt-7 rounded-2xl border border-white/10 px-6 py-10 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                            <Code2 size={27} />
                        </div>

                        <h3 className="mt-4 font-bold">
                            {skills.length
                                ? "No skills in this category"
                                : "Skills are being updated"}
                        </h3>

                        <p className="theme-muted mt-2 text-sm">
                            {skills.length
                                ? "Try selecting another category."
                                : "New technologies and tools will appear here soon."}
                        </p>
                    </div>
                )}

                {/* Bottom Note */}
                {skills.length > 0 && (
                    <Reveal delay={0.2}>
                        <div className="mt-7 flex items-center gap-2 text-xs text-slate-400">
                            <Sparkles size={14} className="text-cyan-400" />
                            Always learning, building, and improving.
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}
