
import {
    Award,
    ExternalLink,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import Reveal from "../Reveal";
import SectionTitle from "../SectionTitle";

export default function CertificationsSection({ certifications = [] }) {
    return (
        <section
            id="certifications"
            className="theme-section section-spacing relative overflow-hidden px-6"
        >
            <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]" />
            <div className="pointer-events-none absolute -right-40 bottom-10 h-72 w-72 rounded-full bg-violet-500/10 blur-[110px]" />

            <div className="relative z-10 mx-auto max-w-6xl">

                <Reveal>
                    <SectionTitle
                        eyebrow="05 / CREDENTIALS"
                        title="Certifications &"
                        accent="achievements"
                    />
                </Reveal>

                {certifications.length > 0 ? (
                    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {certifications.map((certification, index) => (
                            <Reveal
                                key={certification.id || index}
                                delay={index * 0.05}
                            >
                                <article className="group glass certification-card relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10">

                                    <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500 group-hover:w-full" />

                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 transition duration-300 group-hover:rotate-6 group-hover:scale-105">
                                            <Award
                                                size={21}
                                                className="text-cyan-400"
                                            />
                                        </div>

                                        {certification.date && (
                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-cyan-400">
                                                {certification.date}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-5 flex-1">
                                        <h3 className="text-base font-bold leading-snug transition-colors group-hover:text-cyan-400">
                                            {certification.name}
                                        </h3>

                                        <div className="mt-3 flex items-center gap-2">
                                            <ShieldCheck
                                                size={15}
                                                className="shrink-0 text-violet-400"
                                            />

                                            <p className="theme-muted text-xs sm:text-sm">
                                                {certification.issuer}
                                            </p>
                                        </div>
                                    </div>

                                    {certification.credential_url && (
                                        <div className="mt-5 border-t border-white/10 pt-4">
                                            <a
                                                href={certification.credential_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 transition-all duration-300 hover:gap-3 hover:text-violet-400"
                                            >
                                                View Credential
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    )}

                                    <Sparkles
                                        size={16}
                                        className="absolute bottom-5 right-5 text-white/10 transition-all duration-300 group-hover:rotate-12 group-hover:text-cyan-400/40"
                                    />
                                </article>
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <Reveal>
                        <div className="glass mt-7 rounded-xl border border-dashed border-white/15 px-6 py-10 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-400/10">
                                <Award
                                    size={28}
                                    className="text-cyan-400"
                                />
                            </div>

                            <h3 className="mt-4 text-base font-bold">
                                No certifications yet
                            </h3>

                            <p className="theme-muted mt-2 text-xs sm:text-sm">
                                Certifications and achievements will appear
                                here once added through the admin dashboard.
                            </p>
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}
