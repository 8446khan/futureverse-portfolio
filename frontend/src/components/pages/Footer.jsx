
import {
    LayoutDashboard,
    Mail,
    Phone,
    MessageCircle,
    ArrowUpRight,
    Heart,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Footer({ profile = {} }) {
    const name = profile.name || "Khan Shoaib";
    const email = profile.email || "khanshoaiburrhman@gmail.com";
    const phone = "+91-8446289275";
    const whatsappNumber = "918446289275";

    const whatsappMessage = encodeURIComponent(
        "Hello! I visited your portfolio and would like to connect."
    );

    const quickLinks = [
        { label: "Home", href: "#home" },
        { label: "About Me", href: "#about" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <footer className="relative overflow-hidden border-t border-white/10 px-6 py-8 sm:py-10">

            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[100px]" />

            <div className="relative mx-auto max-w-6xl">

                <div className="grid gap-8 border-b border-white/10 pb-7 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-black tracking-tight">
                            <span className="gradient-text">
                                {name}
                            </span>
                            <span className="text-cyan-400">.</span>
                        </h3>

                        <p className="theme-muted mt-3 max-w-xs text-xs leading-6 sm:text-sm">
                            Building digital experiences through creativity,
                            technology, and continuous learning.
                        </p>

                        {profile.location && (
                            <p className="theme-muted mt-3 text-xs">
                                📍 {profile.location}
                            </p>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider">
                            Contact Information
                        </h4>

                        <div className="space-y-3">
                            <a
                                href={`mailto:${email}`}
                                className="flex items-center gap-2.5 break-all text-xs text-slate-400 transition-colors hover:text-cyan-400 sm:text-sm"
                            >
                                <Mail
                                    size={16}
                                    className="shrink-0 text-cyan-400"
                                />
                                {email}
                                <ArrowUpRight size={12} />
                            </a>

                            <a
                                href={`tel:${phone}`}
                                className="flex items-center gap-2.5 text-xs text-slate-400 transition-colors hover:text-cyan-400 sm:text-sm"
                            >
                                <Phone
                                    size={16}
                                    className="text-cyan-400"
                                />
                                {phone}
                                <ArrowUpRight size={12} />
                            </a>

                            <a
                                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-xs text-slate-400 transition-colors hover:text-green-400 sm:text-sm"
                            >
                                <MessageCircle
                                    size={16}
                                    className="text-green-400"
                                />
                                Chat on WhatsApp
                                <ArrowUpRight size={12} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider">
                            Quick Links
                        </h4>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {quickLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-xs text-slate-400 transition-colors hover:text-cyan-400 sm:text-sm"
                                >
                                    {link.label}
                                </a>
                            ))}

                            <Link
                                to="/admin"
                                className="col-span-2 flex items-center gap-2 text-xs text-slate-400 transition-colors hover:text-cyan-400 sm:text-sm"
                            >
                                <LayoutDashboard size={14} />
                                Admin Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center sm:flex-row sm:text-left">

                    <p className="text-[11px] text-slate-500 sm:text-xs">
                        © {new Date().getFullYear()}{" "}
                        <span className="font-semibold text-slate-300">
                            {name}
                        </span>
                        . All rights reserved.
                    </p>

                    <p className="flex items-center gap-2 text-[11px] text-slate-500 sm:text-xs">
                        Designed and developed with
                        <Heart
                            size={13}
                            className="fill-pink-500 text-pink-500"
                        />
                        using modern technology.
                    </p>
                </div>
            </div>
        </footer>
    );
}
