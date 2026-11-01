
import {
    Terminal as TerminalIcon,
    Code2,
    Sparkles,
} from "lucide-react";

import Terminal from "../Terminal";
import Reveal from "../Reveal";
import SectionTitle from "../SectionTitle";

export default function TerminalSection() {
    return (
        <section
            id="terminal"
            className="theme-section relative overflow-hidden px-6 py-24 sm:py-28"
        >
            {/* Background glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.07] blur-[130px]" />

            <div className="relative z-10 mx-auto max-w-5xl">

                {/* Section heading */}
                <Reveal>
                    <SectionTitle
                        eyebrow="07 / EXPLORE"
                        title="A little"
                        accent="terminal"
                    />
                </Reveal>

                {/* Description */}
                <Reveal delay={0.1}>
                    <div className="mx-auto mb-10 mt-6 max-w-2xl text-center">

                        <p className="theme-muted text-sm leading-7 sm:text-base">
                            Curious about how I work? Step into my interactive
                            terminal and explore my skills, projects, and
                            developer journey through a command-line experience.
                        </p>

                    </div>
                </Reveal>

                {/* Terminal container */}
                <Reveal delay={0.2}>
                    <div className="group relative">

                        {/* Outer glow */}
                        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/30 via-violet-500/20 to-cyan-500/30 opacity-40 blur-sm transition duration-500 group-hover:opacity-80" />

                        <div className="glass relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/20">

                            {/* Terminal title bar */}
                            <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-5 py-4">

                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-red-400" />
                                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                                    <span className="h-3 w-3 rounded-full bg-green-400" />
                                </div>

                                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                    <TerminalIcon
                                        size={14}
                                        className="text-cyan-400"
                                    />
                                    <span>developer@portfolio:~</span>
                                </div>

                                <Code2
                                    size={17}
                                    className="text-slate-500"
                                />

                            </div>

                            {/* Terminal content */}
                            <div className="p-3 sm:p-6">
                                <Terminal />
                            </div>

                            {/* Bottom status bar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/20 px-5 py-3">

                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                                    Terminal Ready
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Sparkles
                                        size={13}
                                        className="text-cyan-400"
                                    />
                                    Interactive Developer Experience
                                </div>

                            </div>

                        </div>
                    </div>
                </Reveal>

                {/* Footer hint */}
                <Reveal delay={0.3}>
                    <p className="mt-7 text-center text-xs text-slate-500">
                        <span className="text-cyan-400">Tip:</span>{" "}
                        Type a command and press Enter to explore.
                    </p>
                </Reveal>

            </div>
        </section>
    );
}
