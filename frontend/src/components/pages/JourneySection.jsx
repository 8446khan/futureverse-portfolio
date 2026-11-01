
import { useMemo } from "react";
import {
    GraduationCap,
    BriefcaseBusiness,
    Award,
    BookOpen,
    CalendarDays,
    MapPin,
    Sparkles
} from "lucide-react";

import Reveal from "../Reveal";
import SectionTitle from "../SectionTitle";

const getJourneyIcon = (type = "") => {
    const value = String(type).toLowerCase();

    if (value.includes("education") || value.includes("academic")) {
        return GraduationCap;
    }

    if (value.includes("intern")) {
        return BookOpen;
    }

    if (value.includes("certification") || value.includes("award")) {
        return Award;
    }

    if (
        value.includes("experience") ||
        value.includes("work") ||
        value.includes("job")
    ) {
        return BriefcaseBusiness;
    }

    return Sparkles;
};

export default function JourneySection({ experience = [] }) {
    const sortedExperience = useMemo(() => {
        return [...experience].sort((a, b) => {
            const dateA = new Date(a.start_date || 0).getTime();
            const dateB = new Date(b.start_date || 0).getTime();

            return (
                (Number.isNaN(dateB) ? 0 : dateB) -
                (Number.isNaN(dateA) ? 0 : dateA)
            );
        });
    }, [experience]);

    return (
        <section
            id="journey"
            className="section-muted theme-section section-spacing relative overflow-hidden px-6"
        >
            <div className="mx-auto w-full max-w-6xl">

                <Reveal>
                    <SectionTitle
                        eyebrow="04 / MY JOURNEY"
                        title="Learning &"
                        accent="growing"
                    />

                    <p className="theme-muted -mt-3 max-w-2xl text-sm leading-7 sm:text-base">
                        Every experience is an opportunity to learn,
                        improve, and move forward. Here's a look at my
                        academic and professional journey.
                    </p>
                </Reveal>

                {sortedExperience.length > 0 ? (
                    <div className="mx-auto mt-9 w-full max-w-4xl">
                        <div className="relative">

                            {/* Timeline Line */}
                            <div className="absolute bottom-5 left-[17px] top-5 w-px bg-gradient-to-b from-cyan-400 via-violet-500 to-transparent sm:left-5" />

                            <div className="space-y-6">
                                {sortedExperience.map((item, index) => {
                                    const Icon = getJourneyIcon(item.type);

                                    const endDate = String(
                                        item.end_date || ""
                                    ).trim().toLowerCase();

                                    const isCurrent =
                                        !endDate ||
                                        endDate === "present" ||
                                        endDate === "ongoing";

                                    return (
                                        <Reveal
                                            key={item.id || `${item.title}-${index}`}
                                            delay={index * 0.06}
                                        >
                                            <div className="group relative pl-12 sm:pl-14">

                                                {/* Timeline Marker */}
                                                <div className="timeline-marker absolute left-0 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-950 text-cyan-400 shadow-lg shadow-cyan-500/10 transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-300">
                                                    <Icon size={17} />
                                                </div>

                                                {/* Journey Card */}
                                                <article className="glass rounded-xl border border-white/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 sm:p-5">

                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                                                            <Icon size={12} />
                                                            {item.type || "Milestone"}
                                                        </span>

                                                        {isCurrent && (
                                                            <span className="inline-flex items-center gap-2 text-[10px] font-semibold text-emerald-400">
                                                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                                                CURRENT
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="mt-3 text-base font-bold leading-snug transition-colors group-hover:text-cyan-400 sm:text-lg">
                                                        {item.title || "Untitled Journey"}
                                                    </h3>

                                                    {item.organization && (
                                                        <div className="theme-secondary mt-2 flex items-center gap-2 text-xs sm:text-sm">
                                                            <MapPin
                                                                size={14}
                                                                className="shrink-0 text-cyan-400"
                                                            />
                                                            {item.organization}
                                                        </div>
                                                    )}

                                                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-400">
                                                        <CalendarDays
                                                            size={14}
                                                            className="text-cyan-400"
                                                        />

                                                        <span>
                                                            {item.start_date || "Start date"}
                                                            {" — "}
                                                            {item.end_date || "Present"}
                                                        </span>
                                                    </div>

                                                    {item.description && (
                                                        <p className="theme-muted mt-3 text-xs leading-6 sm:text-sm">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </article>
                                            </div>
                                        </Reveal>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass mx-auto mt-9 w-full max-w-4xl rounded-xl border border-white/10 px-6 py-10 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                            <GraduationCap size={28} />
                        </div>

                        <h3 className="mt-4 text-base font-bold sm:text-lg">
                            My journey is just getting started
                        </h3>

                        <p className="theme-muted mx-auto mt-2 max-w-md text-xs leading-6 sm:text-sm">
                            Education, projects, internships, and professional
                            milestones will appear here as I continue learning
                            and growing.
                        </p>
                    </div>
                )}

                {sortedExperience.length > 0 && (
                    <Reveal delay={0.2}>
                        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                            <Sparkles size={14} className="text-cyan-400" />
                            Every step is part of the journey.
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}
