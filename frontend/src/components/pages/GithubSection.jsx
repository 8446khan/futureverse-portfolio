
import {
    Github,
    ExternalLink,
    Star,
    GitFork,
    Code2,
    Sparkles,
} from "lucide-react";

import Reveal from "../Reveal";
import SectionTitle from "../SectionTitle";

export default function GithubSection({ repositories = [] }) {
    return (
        <section
            id="github"
            className="theme-section section-spacing relative overflow-hidden bg-white/[0.02] px-6"
        >
            <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]" />
            <div className="pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-violet-500/10 blur-[110px]" />

            <div className="relative z-10 mx-auto max-w-6xl">

                <Reveal>
                    <SectionTitle
                        eyebrow="06 / OPEN SOURCE"
                        title="Around"
                        accent="GitHub"
                    />
                </Reveal>

                {repositories.length > 0 ? (
                    <>
                        <Reveal>
                            <div className="mb-7 mt-5 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-cyan-400">
                                        <Github size={15} className="mr-2 inline" />
                                        Open Source Contributions
                                    </p>

                                    <p className="theme-muted mt-1 text-xs sm:text-sm">
                                        Explore my projects, experiments and code.
                                    </p>
                                </div>

                                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-400">
                                    {repositories.length} Repositories
                                </span>
                            </div>
                        </Reveal>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {repositories.map((repository, index) => (
                                <Reveal
                                    key={repository.id || repository.name}
                                    delay={index * 0.05}
                                >
                                    <a
                                        href={repository.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`View ${repository.name} repository on GitHub`}
                                        className="glass group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10"
                                    >
                                        <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500 group-hover:w-full" />

                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10">
                                                <Github
                                                    size={21}
                                                    className="transition-colors group-hover:text-cyan-400"
                                                />
                                            </div>

                                            <ExternalLink
                                                size={16}
                                                className="text-slate-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-400"
                                            />
                                        </div>

                                        <h3 className="mt-4 break-words text-base font-bold transition-colors group-hover:text-cyan-400">
                                            {repository.name}
                                        </h3>

                                        <p className="theme-muted mt-2 min-h-[44px] text-xs leading-6 sm:text-sm">
                                            {repository.description ||
                                                "Explore this public repository and its source code."}
                                        </p>

                                        <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <Code2
                                                    size={14}
                                                    className="text-cyan-400"
                                                />
                                                {repository.language || "Code"}
                                            </div>

                                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <Star
                                                    size={14}
                                                    className="text-yellow-400"
                                                />
                                                {repository.stars ?? 0}
                                            </div>

                                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <GitFork
                                                    size={14}
                                                    className="text-violet-400"
                                                />
                                                {repository.forks ?? 0}
                                            </div>
                                        </div>

                                        <Sparkles
                                            size={16}
                                            className="absolute bottom-5 right-5 text-white/5 transition-all duration-300 group-hover:rotate-12 group-hover:text-cyan-400/30"
                                        />
                                    </a>
                                </Reveal>
                            ))}
                        </div>
                    </>
                ) : (
                    <Reveal>
                        <div className="mt-7 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                <Github
                                    size={28}
                                    className="text-cyan-400"
                                />
                            </div>

                            <h3 className="mt-4 text-base font-bold">
                                GitHub Projects Coming Soon
                            </h3>

                            <p className="theme-muted mx-auto mt-2 max-w-md text-xs leading-6 sm:text-sm">
                                Configure GITHUB_USERNAME in your backend
                                .env file to display your public repositories.
                            </p>
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}
