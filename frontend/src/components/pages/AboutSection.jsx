
import { useState } from "react";
import {
    Code2,
    BrainCircuit,
    Lightbulb,
    ArrowUpRight,
    Target,
    BookOpen,
    CheckCircle2
} from "lucide-react";

import Reveal from "../Reveal";
import SectionTitle from "../SectionTitle";

const highlights = [
    {
        number: "01",
        title: "Problem Solving",
        subtitle: "Think. Analyze. Solve.",
        description:
            "I break complex problems into smaller steps, understand their root causes, and develop practical solutions.",
        icon: Target,
        skills: ["Logical Thinking", "Python", "Debugging"],
        activities: [
            "Breaking problems into manageable tasks",
            "Writing efficient and structured code"
        ]
    },
    {
        number: "02",
        title: "Continuous Learning",
        subtitle: "Learn. Improve. Grow.",
        description:
            "I enjoy exploring new technologies, improving my technical knowledge, and learning through practical experience.",
        icon: BookOpen,
        skills: ["Research", "Adaptability", "Learning"],
        activities: [
            "Exploring new technologies and frameworks",
            "Building knowledge through practical projects"
        ]
    },
    {
        number: "03",
        title: "Creative Development",
        subtitle: "Imagine. Build. Create.",
        description:
            "I turn ideas into useful digital experiences by combining programming, creativity, and modern technologies.",
        icon: Code2,
        skills: ["React", "JavaScript", "Flask"],
        activities: [
            "Developing responsive web interfaces",
            "Building interactive applications"
        ]
    },
    {
        number: "04",
        title: "Data-Driven Thinking",
        subtitle: "Explore. Discover. Understand.",
        description:
            "I enjoy exploring datasets, identifying patterns, and using analytical techniques to discover meaningful insights.",
        icon: BrainCircuit,
        skills: ["Python", "Pandas", "SQL", "NumPy"],
        activities: [
            "Cleaning and analysing datasets",
            "Discovering patterns and meaningful insights"
        ]
    }
];

const technologies = [
    "Python",
    "JavaScript",
    "React",
    "Flask",
    "SQL",
    "Data Analytics",
    "Machine Learning",
    "Pandas",
    "NumPy"
];

export default function AboutSection({ profile }) {
    const [activeCard, setActiveCard] = useState(0);

    const bio =
        profile?.bio ||
        "I am passionate about software development and data analytics. I enjoy building applications, working with data, solving technical problems, and exploring technologies that transform ideas into meaningful solutions.";

    const location = "Kalyan, Maharashtra, India";

    const selected = highlights[activeCard];
    const SelectedIcon = selected.icon;

    return (
        <section
            id="about"
            className="theme-section section-spacing relative overflow-hidden px-6"
        >
            <div className="mx-auto max-w-6xl">

                {/* Heading */}
                <Reveal>
                    <SectionTitle
                        eyebrow="01 / ABOUT ME"
                        title="Get to"
                        accent="know me"
                    />
                </Reveal>

                <div className="mt-7 grid items-center gap-7 lg:grid-cols-2 lg:gap-8">

                    {/* Introduction */}
                    <Reveal>
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-400">
                                    <Code2 size={21} />
                                </div>

                                <span className="text-xs font-semibold tracking-widest text-cyan-400">
                                    WHO I AM
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold leading-snug sm:text-3xl">
                                Developer by curiosity.
                                <br />
                                <span className="gradient-text">
                                    Analyst by mindset.
                                </span>
                            </h3>

                            <p className="theme-muted mt-5 max-w-xl text-sm leading-7 sm:text-base">
                                {bio}
                            </p>

                            <p className="theme-muted mt-3 max-w-xl text-sm leading-7">
                                My interests bring together software
                                development and data analytics. I enjoy
                                creating useful applications, understanding
                                data, and learning how technology can solve
                                real-world problems.
                            </p>

                            {/* Location */}
                            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3.5 py-2 text-xs font-medium text-cyan-500">
                                <span>📍</span>
                                {location}
                            </div>

                            {/* Technologies */}
                            <div className="mt-6">
                                <h4 className="mb-3 text-xs font-bold tracking-widest">
                                    AREAS OF INTEREST
                                </h4>

                                <div className="flex flex-wrap gap-2">
                                    {technologies.map((technology) => (
                                        <span
                                            key={technology}
                                            className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-[11px] font-medium text-cyan-500 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-400/10"
                                        >
                                            {technology}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Interactive Highlights */}
                    <Reveal delay={0.15}>
                        <div className="glass rounded-2xl p-4">

                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan-400">
                                        MY APPROACH
                                    </p>

                                    <h3 className="mt-1 text-lg font-bold">
                                        What drives me?
                                    </h3>
                                </div>

                                <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
                                    <Lightbulb size={20} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2">

                                {/* Cards */}
                                <div className="grid grid-cols-2 content-start gap-2.5">
                                    {highlights.map((item, index) => {
                                        const Icon = item.icon;
                                        const isActive = activeCard === index;

                                        return (
                                            <button
                                                key={item.number}
                                                type="button"
                                                onClick={() => setActiveCard(index)}
                                                aria-pressed={isActive}
                                                className={`rounded-xl border p-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${isActive
                                                    ? "border-cyan-400/60 bg-cyan-400/10 shadow-md shadow-cyan-500/10"
                                                    : "theme-subcard border-transparent hover:border-cyan-400/30"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <Icon
                                                        size={19}
                                                        className={
                                                            isActive
                                                                ? "text-cyan-400"
                                                                : "text-slate-400"
                                                        }
                                                    />

                                                    <span className="text-[10px] text-cyan-400">
                                                        {item.number}
                                                    </span>
                                                </div>

                                                <h4 className="mt-3 text-xs font-bold leading-5">
                                                    {item.title}
                                                </h4>

                                                <p className="theme-muted mt-1 text-[10px]">
                                                    {item.subtitle}
                                                </p>

                                                <div className="mt-2 flex items-center gap-1 text-[10px] text-cyan-400">
                                                    {isActive ? "Selected" : "Explore"}
                                                    <ArrowUpRight size={12} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Details */}
                                <div
                                    key={activeCard}
                                    aria-live="polite"
                                    className="flex flex-col rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3.5 animate-[fadeIn_0.3s_ease-in-out]"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="rounded-lg bg-cyan-400/10 p-2 text-cyan-400">
                                            <SelectedIcon size={18} />
                                        </div>

                                        <div>
                                            <p className="text-[9px] tracking-widest text-cyan-400">
                                                {selected.number} / EXPLORE
                                            </p>

                                            <h4 className="text-xs font-bold">
                                                {selected.title}
                                            </h4>
                                        </div>
                                    </div>

                                    <p className="theme-muted mt-3 text-xs leading-6">
                                        {selected.description}
                                    </p>

                                    <div className="mt-4">
                                        <h5 className="mb-2 text-[10px] font-bold tracking-widest">
                                            RELATED SKILLS
                                        </h5>

                                        <div className="flex flex-wrap gap-1.5">
                                            {selected.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="rounded-full border border-cyan-400/20 px-2 py-1 text-[10px] text-cyan-500"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h5 className="mb-2 text-[10px] font-bold tracking-widest">
                                            MY FOCUS
                                        </h5>

                                        <div className="space-y-2">
                                            {selected.activities.map((activity) => (
                                                <div
                                                    key={activity}
                                                    className="flex items-start gap-1.5"
                                                >
                                                    <CheckCircle2
                                                        size={13}
                                                        className="mt-0.5 shrink-0 text-cyan-400"
                                                    />

                                                    <p className="theme-muted text-[10px] leading-5">
                                                        {activity}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                                <p className="text-[10px] text-slate-400">
                                    {activeCard + 1} / {highlights.length} topics
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveCard(
                                                (activeCard - 1 + highlights.length) %
                                                highlights.length
                                            )
                                        }
                                        className="rounded-full border border-cyan-400/30 px-3 py-1.5 text-[10px] transition hover:bg-cyan-400/10"
                                    >
                                        ← Previous
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveCard(
                                                (activeCard + 1) % highlights.length
                                            )
                                        }
                                        className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-[10px] text-cyan-500 transition hover:bg-cyan-400/20"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
