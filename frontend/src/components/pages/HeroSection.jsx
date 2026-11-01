
import { lazy, Suspense } from "react";
import {
    ArrowRight,
    ChevronDown,
    Download,
    Github,
    Linkedin,
    Mail
} from "lucide-react";

const Scene = lazy(() => import("../../Scene"));

export default function HeroSection({ profile, onNavigate, onResume }) {
    const fallbackName = "Khan Shoaib";

    const displayName =
        !profile?.name?.trim() ||
            profile.name.trim().toLowerCase() === "your name"
            ? fallbackName
            : profile.name.trim();

    const headline =
        profile?.headline || "Software Developer | Data Analyst";

    const bio =
        profile?.bio ||
        "I am passionate about software development and data analytics. I enjoy building web applications, working with Python, analyzing complex datasets, and exploring machine learning to develop practical, data-driven solutions.";

    return (
        <section
            id="home"
            className="hero-section grid-bg relative flex min-h-[90vh] items-center overflow-hidden px-6 pb-16 pt-20"
        >
            {/* 3D Background */}
            <div className="absolute inset-0 z-0 opacity-80">
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </div>

            {/* Overlay */}
            <div className="hero-overlay pointer-events-none absolute inset-0" />

            {/* Main Content */}
            <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">

                <div>
                    <div className="availability-badge mb-5 inline-flex items-center gap-2.5 rounded-full px-3 py-2 text-xs font-semibold">
                        <span className="availability-indicator" />
                        Open to Opportunities
                    </div>

                    <p className="mb-3 text-xs tracking-[.22em] text-slate-400 sm:text-sm">
                        HELLO, I'M {displayName.toUpperCase()}
                    </p>

                    <h1 className="hero-heading">
                        Building
                        <br />
                        <span className="gradient-text">
                            Intelligent
                        </span>
                        <br />
                        Solutions.
                    </h1>

                    <p className="theme-muted mt-5 max-w-xl text-sm leading-7 sm:text-base sm:leading-8">
                        <span className="font-semibold">
                            {headline}
                        </span>
                        {" — "}
                        {bio}
                    </p>

                    {/* Technologies */}
                    <div className="mt-5 flex flex-wrap gap-2">
                        {[
                            "Python",
                            "JavaScript",
                            "React",
                            "Flask",
                            "SQL",
                            "Data Analytics",
                            "Machine Learning"
                        ].map((skill) => (
                            <span
                                key={skill}
                                className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-500"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="mt-7 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => onNavigate("projects")}
                            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            Explore Projects
                            <ArrowRight
                                size={17}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </button>

                        <a
                            href="/resume.pdf"
                            download
                            onClick={onResume}
                            className="hero-resume flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:text-cyan-400"
                        >
                            <Download size={16} />
                            Download Resume
                        </a>
                    </div>

                    {/* Social Links */}
                    <div className="mt-7 flex gap-4 text-slate-400">
                        {profile?.github && (
                            <a
                                href={profile.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="transition hover:text-cyan-400"
                            >
                                <Github size={20} />
                            </a>
                        )}

                        {profile?.linkedin && (
                            <a
                                href={profile.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="transition hover:text-cyan-400"
                            >
                                <Linkedin size={20} />
                            </a>
                        )}

                        {profile?.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                aria-label="Email"
                                className="transition hover:text-cyan-400"
                            >
                                <Mail size={20} />
                            </a>
                        )}
                    </div>
                </div>

                {/* 3D Animation Space */}
                <div className="hidden min-h-[340px] lg:block" />
            </div>

            {/* Scroll Indicator */}
            <button
                type="button"
                onClick={() => onNavigate("about")}
                className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-slate-500 transition hover:translate-y-1 hover:text-cyan-400"
                aria-label="Scroll to about section"
            >
                <ChevronDown size={24} className="animate-bounce" />
            </button>
        </section>
    );
}
