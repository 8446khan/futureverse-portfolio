
import {
    Send,
    Mail,
    Sparkles,
    MessageCircle,
    ArrowUpRight,
} from "lucide-react";

import Reveal from "../Reveal";

export default function ContactSection({
    profile = {},
    status,
    onSubmit
}) {
    const isLoading =
        typeof status === "string" &&
        /sending|loading|submitting/i.test(status);

    const isError =
        typeof status === "string" &&
        /error|failed|unable|something went wrong/i.test(status);

    const email = profile.email || "khanshoaiburrhman@gmail.com";

    const whatsappNumber = "918446289275";

    const whatsappMessage = encodeURIComponent(
        "Hello, I visited your portfolio and would like to connect with you."
    );

    const whatsappLink =
        `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <section
            id="contact"
            className="theme-section section-spacing relative overflow-hidden px-6"
        >
            <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]" />
            <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-5xl">
                <Reveal>
                    <div className="contact-card glass group relative overflow-hidden rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/20 sm:p-8 lg:p-10">

                        <div className="contact-glow pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

                        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" />

                        <div className="relative text-center">
                            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                                <MessageCircle
                                    size={23}
                                    className="text-cyan-400"
                                />
                            </div>

                            <p className="flex items-center justify-center gap-2 text-[11px] font-bold tracking-[.22em] text-cyan-400">
                                <Sparkles size={13} />
                                08 / GET IN TOUCH
                            </p>

                            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                                Have an idea?
                                <br />
                                <span className="gradient-text">
                                    Let's build it.
                                </span>
                            </h2>

                            <p className="theme-muted mx-auto mt-4 max-w-xl text-sm leading-7">
                                Have a project in mind, a collaboration
                                opportunity, or just want to talk technology?
                                I'd love to hear from you. Let's create
                                something meaningful together.
                            </p>
                        </div>

                        {/* Contact Form */}
                        <form
                            onSubmit={onSubmit}
                            className="relative mx-auto mt-8 max-w-xl space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="contact-name"
                                    className="mb-2 block text-xs font-medium sm:text-sm"
                                >
                                    Your Name
                                </label>

                                <input
                                    required
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    maxLength={100}
                                    className="theme-input w-full rounded-lg border border-white/10 p-3.5 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-email"
                                    className="mb-2 block text-xs font-medium sm:text-sm"
                                >
                                    Email Address
                                </label>

                                <input
                                    required
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="example@email.com"
                                    maxLength={254}
                                    className="theme-input w-full rounded-lg border border-white/10 p-3.5 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-subject"
                                    className="mb-2 block text-xs font-medium sm:text-sm"
                                >
                                    Subject
                                </label>

                                <input
                                    required
                                    id="contact-subject"
                                    name="subject"
                                    type="text"
                                    placeholder="What would you like to discuss?"
                                    maxLength={150}
                                    className="theme-input w-full rounded-lg border border-white/10 p-3.5 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-message"
                                    className="mb-2 block text-xs font-medium sm:text-sm"
                                >
                                    Your Message
                                </label>

                                <textarea
                                    required
                                    id="contact-message"
                                    name="message"
                                    rows={4}
                                    maxLength={5000}
                                    placeholder="Tell me about your project or idea..."
                                    className="theme-input w-full resize-y rounded-lg border border-white/10 p-3.5 text-sm leading-6 outline-none transition-all placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                                />
                            </div>

                            {/* Honeypot field */}
                            <div className="hidden" aria-hidden="true">
                                <label htmlFor="contact-website">
                                    Website
                                </label>

                                <input
                                    id="contact-website"
                                    name="website"
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group/button flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 p-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send
                                            size={17}
                                            className="transition-transform group-hover/button:translate-x-1"
                                        />
                                        Send Message
                                        <ArrowUpRight size={16} />
                                    </>
                                )}
                            </button>

                            {status && (
                                <div
                                    role="status"
                                    aria-live="polite"
                                    className={`rounded-lg border p-3 text-center text-xs ${isError
                                        ? "border-red-400/20 bg-red-400/10 text-red-400"
                                        : "border-cyan-400/20 bg-cyan-400/10 text-cyan-400"
                                        }`}
                                >
                                    {status}
                                </div>
                            )}
                        </form>

                        {/* Direct Contact */}
                        <div className="relative mt-8 border-t border-white/10 pt-6 text-center">
                            <p className="theme-muted mb-4 text-[10px] font-semibold uppercase tracking-[.2em]">
                                Or reach me directly
                            </p>

                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-7">
                                <a
                                    href={`mailto:${email}`}
                                    className="inline-flex items-center gap-2 break-all text-xs font-semibold text-cyan-400 transition-colors hover:text-violet-400 sm:text-sm"
                                >
                                    <Mail size={17} />
                                    {email}
                                    <ArrowUpRight size={14} />
                                </a>

                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-green-400 transition-colors hover:text-green-300 sm:text-sm"
                                >
                                    <MessageCircle size={18} />
                                    Chat on WhatsApp
                                    <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    <p className="theme-muted mt-6 text-center text-xs">
                        <span className="text-cyan-400">✦</span>
                        {" "}Every great collaboration starts with a conversation.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
