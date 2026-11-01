
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "./api";

import {
    LayoutDashboard,
    FolderKanban,
    Wrench,
    Briefcase,
    Award,
    Mail,
    LogOut,
    Plus,
    Trash2,
    Edit,
    Eye,
    ArrowLeft,
    LockKeyhole,
    Sparkles,
    ShieldCheck,
    Code2,
    ArrowUpRight,
    RefreshCw,
    Search,
    X,
    ExternalLink,
    Clock3,
    CheckCircle2,
    MessageSquare,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

const sections = [
    ["overview", "Overview", LayoutDashboard],
    ["projects", "Projects", FolderKanban],
    ["skills", "Skills", Wrench],
    ["experience", "Experience", Briefcase],
    ["certifications", "Certifications", Award],
    ["messages", "Messages", Mail],
];

const fields = {
    projects: [
        ["title", "Title"],
        ["category", "Category"],
        ["description", "Description"],
        ["technologies", "Technologies (comma separated)"],
        ["github_url", "GitHub URL"],
        ["demo_url", "Demo URL"],
        ["image_url", "Image URL"],
    ],

    skills: [
        ["name", "Name"],
        ["category", "Category"],
        ["level", "Level"],
        ["icon", "Icon"],
        ["order", "Order"],
    ],

    experience: [
        ["title", "Title"],
        ["organization", "Organization"],
        ["description", "Description"],
        ["start_date", "Start date"],
        ["end_date", "End date"],
        ["type", "Type"],
    ],

    certifications: [
        ["name", "Name"],
        ["issuer", "Issuer"],
        ["date", "Date"],
        ["credential_url", "Credential URL"],
    ],
};

const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

export default function Admin() {
    const [token, setToken] = useState(
        () => localStorage.getItem("fv_token")
    );

    const [section, setSection] = useState("overview");
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});
    const [busy, setBusy] = useState(false);
    const [search, setSearch] = useState("");

    const nav = useNavigate();

    // Load dashboard data
    const load = useCallback(async () => {
        try {
            setError("");
            setLoading(true);

            if (section === "overview") {
                const result = await api("/admin/analytics");
                setStats(result || {});
            } else {
                const result = await api(`/admin/${section}`);

                setData(
                    Array.isArray(result)
                        ? result
                        : Array.isArray(result?.items)
                            ? result.items
                            : []
                );
            }
        } catch (e) {
            setError(e.message || "Unable to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }, [section]);

    // Handle expired authentication
    useEffect(() => {
        function handleSessionExpired() {
            localStorage.removeItem("fv_token");
            localStorage.removeItem("fv_refresh_token");

            setToken(null);
            setData([]);
            setStats({});
            setEditing(null);
            setForm({});
            setPassword("");
            setError("Your session has expired. Please log in again.");
        }

        window.addEventListener(
            "fv:auth-expired",
            handleSessionExpired
        );

        return () => {
            window.removeEventListener(
                "fv:auth-expired",
                handleSessionExpired
            );
        };
    }, []);

    // Load data when section changes
    useEffect(() => {
        if (token) {
            load();
        }
    }, [token, load]);

    // Login
    async function login(e) {
        e.preventDefault();

        setError("");
        setBusy(true);

        try {
            const response = await api("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response?.access_token || !response?.refresh_token) {
                throw new Error(
                    "Authentication tokens were not returned by the backend."
                );
            }

            localStorage.setItem(
                "fv_token",
                response.access_token
            );

            localStorage.setItem(
                "fv_refresh_token",
                response.refresh_token
            );

            setToken(response.access_token);
            setPassword("");
            setError("");
        } catch (e) {
            setError(e.message || "Login failed. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    // Logout
    function logout() {
        localStorage.removeItem("fv_token");
        localStorage.removeItem("fv_refresh_token");

        setToken(null);
        setData([]);
        setStats({});
        setEditing(null);
        setForm({});
        setPassword("");
        setError("");
        setSection("overview");

        nav("/");
    }

    // Change section
    function changeSection(id) {
        setSection(id);
        setEditing(null);
        setForm({});
        setSearch("");
        setError("");
    }

    // Create or edit
    function startEdit(item = null) {
        setEditing(item?.id ?? "new");

        setForm(
            item
                ? {
                    ...item,
                    technologies: Array.isArray(item.technologies)
                        ? item.technologies.join(", ")
                        : item.technologies || "",
                }
                : {}
        );
    }

    // Save record
    async function save(e) {
        e.preventDefault();

        if (!fields[section] || !editing) {
            return;
        }

        setBusy(true);
        setError("");

        try {
            const payload = { ...form };

            if (section === "projects") {
                payload.technologies = (
                    payload.technologies || ""
                )
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
            }

            if (section === "skills" && payload.order !== undefined && payload.order !== "") {
                payload.order = Number(payload.order);
            }

            const path = `/admin/${section}`;

            await api(
                editing === "new"
                    ? path
                    : `${path}/${editing}`,
                {
                    method: editing === "new" ? "POST" : "PUT",
                    body: JSON.stringify(payload),
                }
            );

            setEditing(null);
            setForm({});

            await load();
        } catch (e) {
            setError(e.message || "Unable to save this record.");
        } finally {
            setBusy(false);
        }
    }

    // Delete record
    async function remove(id) {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            setError("");

            await api(`/admin/${section}/${id}`, {
                method: "DELETE",
            });

            await load();
        } catch (e) {
            setError(e.message || "Unable to delete this item.");
        }
    }

    // Update message status
    async function messageAction(id, read) {
        try {
            setError("");

            await api(`/admin/messages/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ read }),
            });

            await load();
        } catch (e) {
            setError(e.message || "Unable to update message.");
        }
    }

    // Delete message
    async function deleteMessage(id) {
        if (!window.confirm("Delete this message permanently?")) {
            return;
        }

        try {
            setError("");

            await api(`/admin/messages/${id}`, {
                method: "DELETE",
            });

            await load();
        } catch (e) {
            setError(e.message || "Unable to delete message.");
        }
    }

    // Filter records
    const filteredData = data.filter((item) => {
        const value = [
            item.title,
            item.name,
            item.category,
            item.organization,
            item.issuer,
            item.email,
            item.subject,
            item.message,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return value.includes(search.toLowerCase());
    });

    // Login screen

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050816] px-4 py-5">
                <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] shadow-2xl shadow-cyan-500/5 lg:grid-cols-2">

                    {/* LEFT PANEL */}
                    <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#111c36] via-[#0b1428] to-[#080d1c] p-7 sm:p-8 lg:border-b-0 lg:border-r lg:p-9">

                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

                        <div className="relative z-10">

                            {/* BRAND */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                                    <Code2 className="h-6 w-6 text-cyan-400" />
                                </div>

                                <div>
                                    <h1 className="text-xl font-bold tracking-wider text-white">
                                        SK.<span className="text-cyan-400">PORTFOLIO</span>
                                    </h1>
                                    <p className="text-[10px] uppercase tracking-[3px] text-slate-500">
                                        Admin Console
                                    </p>
                                </div>
                            </div>

                            {/* INTRO */}
                            <div className="mt-7 lg:mt-9">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5">
                                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                                    <span className="text-xs font-medium text-cyan-300">
                                        Personal Portfolio Management
                                    </span>
                                </div>

                                <h2 className="max-w-md text-3xl font-bold leading-tight text-white sm:text-4xl">
                                    Manage your
                                    <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                        Digital Universe.
                                    </span>
                                </h2>

                                <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                                    Control your projects, skills, experience and
                                    portfolio content from one powerful dashboard.
                                </p>
                            </div>

                            {/* DASHBOARD PREVIEW */}
                            <div className="relative mt-6 rounded-2xl border border-white/10 bg-[#080e1c]/80 p-3 shadow-xl backdrop-blur-xl">

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Dashboard Overview
                                        </p>
                                        <h3 className="mt-1 text-sm font-semibold text-white">
                                            Welcome Back, Admin
                                        </h3>
                                    </div>

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10">
                                        <FolderKanban className="h-4 w-4 text-cyan-400" />
                                    </div>
                                </div>

                                {/* STATS */}
                                <div className="mt-4 grid grid-cols-3 gap-2">

                                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                                        <FolderKanban className="mb-2 h-4 w-4 text-cyan-400" />
                                        <p className="text-lg font-bold text-white">12+</p>
                                        <p className="text-[10px] text-slate-500">
                                            Projects
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                                        <Wrench className="mb-2 h-4 w-4 text-purple-400" />
                                        <p className="text-lg font-bold text-white">20+</p>
                                        <p className="text-[10px] text-slate-500">
                                            Skills
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                                        <Mail className="mb-2 h-4 w-4 text-emerald-400" />
                                        <p className="text-lg font-bold text-white">08</p>
                                        <p className="text-[10px] text-slate-500">
                                            Messages
                                        </p>
                                    </div>

                                </div>

                                {/* ACTIVITY CHART */}
                                <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-slate-300">
                                            Portfolio Activity
                                        </p>
                                        <span className="text-[10px] text-emerald-400">
                                            +24.8%
                                        </span>
                                    </div>

                                    <div className="mt-4 flex h-9 items-end gap-2">
                                        {[35, 55, 42, 75, 50, 85, 65, 95, 70, 100].map(
                                            (height, index) => (
                                                <div
                                                    key={index}
                                                    className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-500/30 to-cyan-400"
                                                    style={{ height: `${height}%` }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* FEATURES */}
                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                    Secure Access
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Sparkles className="h-4 w-4 text-cyan-400" />
                                    Smart Management
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="flex flex-col justify-center bg-[#0b1020] p-7 sm:p-8 lg:p-9">

                        {/* BACK LINK */}
                        <Link
                            to="/"
                            className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-400"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Portfolio
                        </Link>

                        {/* LOGIN HEADING */}
                        <div className="mb-6">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                                <LockKeyhole className="h-6 w-6 text-cyan-400" />
                            </div>

                            <h2 className="text-3xl font-bold text-white">
                                Welcome Back
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Sign in to access your admin dashboard.
                            </p>
                        </div>

                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* LOGIN FORM */}
                        <form onSubmit={login} className="space-y-4">

                            {/* EMAIL */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        required
                                        autoComplete="username"
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-300">
                                        Password
                                    </label>
                                </div>

                                <div className="relative">
                                    <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        autoComplete="current-password"
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 transition hover:text-cyan-400"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                disabled={busy}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {busy ? "Signing in..." : "Sign In to Dashboard"}

                                {!busy && (
                                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                )}
                            </button>

                        </form>

                        {/* SECURITY FOOTER */}
                        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            Your account is protected with secure authentication.
                        </div>

                        <div className="mt-7 border-t border-white/5 pt-5 text-center">
                            <p className="text-xs text-slate-600">
                                © {new Date().getFullYear()} FUTUREVERSE.
                                All rights reserved.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        );
    }


    // Dashboard
    return (
        <div className="min-h-screen bg-[#080b16] text-white md:flex">

            {/* Sidebar */}
            <aside className="relative z-20 w-full shrink-0 border-b border-white/10 bg-[#0d1120] p-5 md:sticky md:top-0 md:h-screen md:w-64 md:overflow-y-auto md:border-b-0 md:border-r">

                <Link to="/" className="flex items-center gap-3 text-xl font-black">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                        <Code2 size={21} className="text-violet-300" />
                    </div>
                    <span className="gradient-text">FUTUREVERSE.</span>
                </Link>

                <p className="mb-5 mt-2 pl-1 text-[10px] font-bold tracking-[.25em] text-slate-500">
                    ADMIN CONSOLE
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-1">
                    {sections.map(([id, label, Icon]) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => changeSection(id)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${section === id
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon size={17} />
                            {label}

                            {id === "messages" && stats.unread_messages > 0 && (
                                <span className="ml-auto rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] text-cyan-300">
                                    {stats.unread_messages}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                    <Link
                        to="/"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <ArrowLeft size={17} />
                        View portfolio
                    </Link>

                    <button
                        type="button"
                        onClick={logout}
                        className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                        <LogOut size={17} />
                        Sign out
                    </button>
                </div>

                <div className="mt-8 hidden rounded-2xl border border-green-400/10 bg-green-400/5 p-4 md:block">
                    <div className="flex items-center gap-2 text-xs font-semibold text-green-300">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        System active
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                        Your portfolio management workspace is ready.
                    </p>
                </div>
            </aside>

            {/* Main content */}
            <main className="min-w-0 flex-1 p-5 sm:p-7 lg:p-10">

                {/* Header */}
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold tracking-[.2em] text-cyan-300">
                            <Sparkles size={14} />
                            CONTROL CENTER
                        </div>

                        <h1 className="mt-2 text-3xl font-black capitalize sm:text-4xl">
                            {section}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Manage and monitor your portfolio content.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={load}
                            disabled={loading}
                            title="Refresh data"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={17}
                                className={loading ? "animate-spin" : ""}
                            />
                        </button>

                        {fields[section] && !editing && (
                            <button
                                type="button"
                                onClick={() => startEdit()}
                                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
                            >
                                <Plus size={17} />
                                Add new
                            </button>
                        )}
                    </div>
                </header>

                {/* Error */}
                {error && (
                    <div className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">
                        <RefreshCw size={15} className="animate-spin" />
                        Loading dashboard data...
                    </div>
                )}

                {/* Overview */}
                {section === "overview" && (
                    <div className="space-y-7">

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                {
                                    label: "Page views",
                                    value: stats.total_views || 0,
                                    icon: Eye,
                                    color: "text-cyan-300",
                                    bg: "bg-cyan-400/10",
                                },
                                {
                                    label: "Resume downloads",
                                    value: stats.resume_downloads || 0,
                                    icon: ArrowUpRight,
                                    color: "text-violet-300",
                                    bg: "bg-violet-400/10",
                                },
                                {
                                    label: "Unread messages",
                                    value: stats.unread_messages || 0,
                                    icon: Mail,
                                    color: "text-amber-300",
                                    bg: "bg-amber-400/10",
                                },
                                {
                                    label: "Projects",
                                    value: stats.projects || 0,
                                    icon: FolderKanban,
                                    color: "text-green-300",
                                    bg: "bg-green-400/10",
                                },
                            ].map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.label}
                                        className="group rounded-2xl border border-white/10 bg-[#101626] p-5 transition hover:-translate-y-1 hover:border-violet-400/30"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-400">
                                                {item.label}
                                            </p>
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}>
                                                <Icon size={19} className={item.color} />
                                            </div>
                                        </div>

                                        <p className="mt-5 text-3xl font-black">
                                            {item.value}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-600">
                                            Portfolio statistics
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

                            {/* Chart */}
                            <div className="rounded-2xl border border-white/10 bg-[#101626] p-5 sm:p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-bold">
                                            Recent page activity
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Page views overview
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-violet-500/10 p-2 text-violet-300">
                                        <LayoutDashboard size={18} />
                                    </div>
                                </div>

                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={Array.isArray(stats.recent_views) ? stats.recent_views : []}
                                            margin={{
                                                top: 10,
                                                right: 5,
                                                left: -20,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid
                                                stroke="#ffffff"
                                                strokeOpacity={0.06}
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="page"
                                                stroke="#64748b"
                                                tickLine={false}
                                                axisLine={false}
                                            />

                                            <YAxis
                                                stroke="#64748b"
                                                tickLine={false}
                                                axisLine={false}
                                            />

                                            <Tooltip
                                                contentStyle={{
                                                    background: "#111827",
                                                    border: "1px solid #334155",
                                                    borderRadius: "12px",
                                                    color: "#fff",
                                                }}
                                            />

                                            <Bar
                                                dataKey="views"
                                                fill="#8b5cf6"
                                                radius={[6, 6, 0, 0]}
                                                maxBarSize={45}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Quick actions */}
                            <div className="rounded-2xl border border-white/10 bg-[#101626] p-5 sm:p-6">
                                <h2 className="font-bold">
                                    Quick actions
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Manage your portfolio
                                </p>

                                <div className="mt-5 space-y-3">
                                    {[
                                        ["Add project", "projects", FolderKanban],
                                        ["Add skill", "skills", Wrench],
                                        ["Add experience", "experience", Briefcase],
                                        ["View messages", "messages", Mail],
                                    ].map(([label, id, Icon]) => (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => {
                                                changeSection(id);

                                                if (id !== "messages") {
                                                    setEditing("new");
                                                    setForm({});
                                                }
                                            }}
                                            className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4 text-left transition hover:border-violet-400/30 hover:bg-violet-500/5"
                                        >
                                            <span className="flex items-center gap-3 text-sm text-slate-300">
                                                <Icon size={17} className="text-violet-300" />
                                                {label}
                                            </span>
                                            <ArrowUpRight size={16} className="text-slate-500" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search */}
                {fields[section] && !editing && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-[#101626] px-4">
                        <Search size={18} className="text-slate-500" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Search ${section}...`}
                            className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-600"
                        />
                    </div>
                )}

                {/* Create / Edit form */}
                {fields[section] && editing && (
                    <form
                        onSubmit={save}
                        className="max-w-3xl rounded-2xl border border-white/10 bg-[#101626] p-5 sm:p-7"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-widest text-violet-300">
                                    CONTENT MANAGEMENT
                                </p>
                                <h2 className="mt-2 text-xl font-bold capitalize">
                                    {editing === "new" ? "Create" : "Edit"}{" "}
                                    {section.slice(0, -1)}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(null);
                                    setForm({});
                                }}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                                aria-label="Close form"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {fields[section].map(([key, label]) => (
                                <label
                                    key={key}
                                    className={`block text-sm text-slate-300 ${key === "description" || key === "technologies"
                                        ? "sm:col-span-2"
                                        : ""
                                        }`}
                                >
                                    {label}

                                    {key === "description" ? (
                                        <textarea
                                            rows={5}
                                            value={form[key] || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    [key]: e.target.value,
                                                })
                                            }
                                            placeholder={`Enter ${label.toLowerCase()}...`}
                                            className={inputClass}
                                        />
                                    ) : (
                                        <input
                                            type={
                                                key.includes("url")
                                                    ? "url"
                                                    : key === "order"
                                                        ? "number"
                                                        : "text"
                                            }
                                            value={form[key] ?? ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    [key]: e.target.value,
                                                })
                                            }
                                            placeholder={`Enter ${label.toLowerCase()}...`}
                                            className={inputClass}
                                        />
                                    )}
                                </label>
                            ))}
                        </div>

                        <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
                            <label className="flex items-center gap-3 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={form.published !== false}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            published: e.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 accent-violet-500"
                                />
                                Published
                            </label>

                            {section === "projects" && (
                                <label className="flex items-center gap-3 text-sm text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={!!form.featured}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                featured: e.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 accent-violet-500"
                                    />
                                    Featured project
                                </label>
                            )}
                        </div>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={busy}
                                className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold transition hover:bg-violet-500 disabled:opacity-50"
                            >
                                {busy ? (
                                    <>
                                        <RefreshCw size={16} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} />
                                        Save changes
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(null);
                                    setForm({});
                                }}
                                className="rounded-xl border border-white/10 px-6 py-3 text-sm text-slate-300 transition hover:bg-white/5"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Projects, Skills, Experience, Certifications */}
                {fields[section] && !editing && (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {filteredData.map((item) => {
                            const technologies = Array.isArray(item.technologies)
                                ? item.technologies
                                : typeof item.technologies === "string"
                                    ? item.technologies.split(",").map((tech) => tech.trim()).filter(Boolean)
                                    : [];

                            return (
                                <div
                                    key={item.id}
                                    className="group rounded-2xl border border-white/10 bg-[#101626] p-5 transition hover:border-violet-400/30"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="truncate font-bold">
                                                {item.title || item.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-400">
                                                {item.category ||
                                                    item.organization ||
                                                    item.issuer ||
                                                    item.level ||
                                                    item.type}
                                            </p>

                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                                                {item.description || "No description provided."}
                                            </p>

                                            {section === "projects" && technologies.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {technologies.map((tech, index) => (
                                                        <span
                                                            key={`${tech}-${index}`}
                                                            className="rounded-lg bg-violet-500/10 px-2 py-1 text-[10px] text-violet-300"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold ${item.published === false
                                                ? "bg-amber-400/10 text-amber-300"
                                                : "bg-green-400/10 text-green-300"
                                                }`}
                                        >
                                            {item.published === false ? "Draft" : "Live"}
                                        </span>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => startEdit(item)}
                                            className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-violet-500/15 hover:text-violet-300"
                                        >
                                            <Edit size={14} />
                                            Edit
                                        </button>

                                        {item.demo_url && (
                                            <a
                                                href={item.demo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10"
                                            >
                                                <ExternalLink size={14} />
                                                Preview
                                            </a>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => remove(item.id)}
                                            className="flex items-center gap-2 rounded-lg bg-red-500/5 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/15"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {!loading && filteredData.length === 0 && (
                            <div className="col-span-full rounded-2xl border border-dashed border-white/10 py-16 text-center">
                                <FolderKanban
                                    size={32}
                                    className="mx-auto text-slate-600"
                                />
                                <p className="mt-4 font-semibold text-slate-300">
                                    No records found
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Add a new record or try another search.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Messages */}
                {section === "messages" && (
                    <div className="space-y-4">
                        {filteredData.map((message) => (
                            <div
                                key={message.id}
                                className={`rounded-2xl border bg-[#101626] p-5 transition ${message.read
                                    ? "border-white/10"
                                    : "border-cyan-400/20"
                                    }`}
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-bold">
                                                {message.subject}
                                            </h3>

                                            {!message.read && (
                                                <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] font-bold text-cyan-300">
                                                    NEW
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 text-sm text-cyan-300">
                                            {message.name}
                                        </p>

                                        <a
                                            href={`mailto:${message.email}`}
                                            className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 transition hover:text-cyan-300"
                                        >
                                            {message.email}
                                            <ArrowUpRight size={12} />
                                        </a>
                                    </div>

                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                        <Clock3 size={13} />
                                        {message.read ? "Read" : "Unread"}
                                    </span>
                                </div>

                                <div className="my-5 rounded-xl bg-white/[0.03] p-4">
                                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                        {message.message}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={`mailto:${message.email}?subject=${encodeURIComponent(
                                            `Re: ${message.subject || "Your message"}`
                                        )}`}
                                        className="flex items-center gap-2 rounded-lg bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20"
                                    >
                                        <Mail size={14} />
                                        Reply by email
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            messageAction(
                                                message.id,
                                                !message.read
                                            )
                                        }
                                        className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10"
                                    >
                                        <Eye size={14} />
                                        {message.read ? "Mark unread" : "Mark read"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteMessage(message.id)}
                                        className="flex items-center gap-2 rounded-lg bg-red-500/5 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/15"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                        {!loading && filteredData.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
                                <MessageSquare
                                    size={32}
                                    className="mx-auto text-slate-600"
                                />
                                <p className="mt-4 font-semibold text-slate-300">
                                    No messages found
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Messages submitted through your contact form will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}
