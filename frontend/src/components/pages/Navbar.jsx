
import { Menu, Moon, Sun, X } from "lucide-react";

export default function Navbar({
    mobile,
    setMobile,
    light,
    setLight,
    onNavigate
}) {
    const navItems = [
        "About",
        "Skills",
        "Projects",
        "Journey",
        "Contact",
        "Terminal"
    ];

    const handleNavigate = (section) => {
        onNavigate(section);
        setMobile(false);
    };

    return (
        <header
            className={`fixed top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300 ${light
                ? "border-slate-200 bg-white/95 text-slate-900"
                : "border-white/10 bg-[#070914]/95 text-white"
                }`}
        >
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">

                {/* Logo */}
                <button
                    type="button"
                    onClick={() => handleNavigate("home")}
                    className="flex items-center gap-2 text-xl font-black tracking-tight"
                    aria-label="Go to homepage"
                >
                    <span className="gradient-text">SK.</span>

                    <span
                        className={`text-xs font-medium tracking-[0.2em] ${light ? "text-slate-500" : "text-slate-400"
                            }`}
                    >
                        PORTFOLIO
                    </span>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-5 lg:flex">
                    {navItems.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => handleNavigate(item.toLowerCase())}
                            className={`text-sm transition-colors ${light
                                ? "text-slate-600 hover:text-indigo-600"
                                : "text-slate-400 hover:text-cyan-300"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setLight(!light)}
                        className={`rounded-full border p-2 transition-colors ${light
                            ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                            : "border-white/15 text-slate-200 hover:bg-white/10"
                            }`}
                        aria-label="Toggle theme"
                    >
                        {light ? <Moon size={17} /> : <Sun size={17} />}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleNavigate("contact")}
                        className="hidden rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-500 transition-colors hover:bg-cyan-400/10 md:block"
                    >
                        Let's talk ↗
                    </button>

                    <button
                        type="button"
                        className="lg:hidden"
                        onClick={() => setMobile(!mobile)}
                        aria-label="Toggle navigation"
                        aria-expanded={mobile}
                    >
                        {mobile ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            {mobile && (
                <div
                    className={`border-t p-3 lg:hidden ${light
                        ? "border-slate-200 bg-white"
                        : "border-white/10 bg-[#070914]"
                        }`}
                >
                    {navItems.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => handleNavigate(item.toLowerCase())}
                            className={`block w-full p-2.5 text-left text-sm transition-colors ${light
                                ? "text-slate-700 hover:text-indigo-600"
                                : "text-slate-300 hover:text-cyan-300"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
}
