
import { useState, useEffect, useRef } from "react";
import { Terminal as TermIcon } from "lucide-react";

export default function Terminal() {
    const [cmd, setCmd] = useState("");
    const [history, setHistory] = useState([
        "Welcome to the portfolio terminal.",
        "Type help to see available commands.",
    ]);

    const terminalRef = useRef(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop =
                terminalRef.current.scrollHeight;
        }
    }, [history]);

    function run(e) {
        e.preventDefault();

        const command = cmd.trim().toLowerCase();

        if (!command) return;

        const output = {
            help: "Commands: help, about, skills, projects, contact, clear",
            about:
                "A curious technology enthusiast building with software, data and AI.",
            skills:
                "Python · React · Flask · SQLite · SQL · Machine Learning",
            projects:
                "Explore the Projects section to see featured work.",
            contact:
                "Use the contact form or email hello@example.com",
        };

        setHistory((previous) =>
            command === "clear"
                ? []
                : [
                    ...previous,
                    `visitor@portfolio:~$ ${cmd}`,
                    output[command] || `Command not found: ${command}. Type help.`,
                ]
        );

        setCmd("");
    }

    return (
        <div className="glass overflow-hidden rounded-2xl text-left">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <TermIcon size={16} className="text-green-400" />

                <span className="text-xs text-slate-400">
                    visitor@futureverse — interactive terminal
                </span>
            </div>

            {/* Terminal Output */}
            <div
                ref={terminalRef}
                className="h-44 space-y-2 overflow-y-auto p-4 font-mono text-xs text-green-300"
                aria-live="polite"
            >
                {history.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>

            {/* Command Input */}
            <form
                onSubmit={run}
                className="flex border-t border-white/10 p-3 font-mono text-sm"
            >
                <span className="mr-2 text-green-400">$</span>

                <input
                    value={cmd}
                    onChange={(e) => setCmd(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent outline-none"
                    placeholder="type a command..."
                    aria-label="Enter terminal command"
                    autoComplete="off"
                />
            </form>
        </div>
    );
}
