
import { useState } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { api } from "../api";

export default function Assistant() {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const [items, setItems] = useState([
        {
            from: "bot",
            text: "Hi! Ask me about the portfolio owner's skills, projects or background.",
        },
    ]);
    const [busy, setBusy] = useState(false);

    async function send(e) {
        e?.preventDefault();

        const question = q.trim();
        if (!question || busy) return;

        setQ("");
        setItems((v) => [...v, { from: "you", text: question }]);
        setBusy(true);

        try {
            const r = await api("/assistant", {
                method: "POST",
                body: JSON.stringify({ question }),
            });

            setItems((v) => [
                ...v,
                {
                    from: "bot",
                    text: r.answer || "I couldn't find an answer to that question.",
                },
            ]);
        } catch {
            setItems((v) => [
                ...v,
                {
                    from: "bot",
                    text: "I can't connect right now. Please try again later.",
                },
            ]);
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close assistant" : "Open assistant"}
                aria-expanded={open}
                className="fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 p-4 shadow-xl shadow-violet-900/40"
            >
                {open ? <X /> : <MessageCircle />}
            </button>

            {open && (
                <div className="glass fixed bottom-24 right-5 z-40 flex h-[430px] w-[min(360px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl shadow-2xl">
                    <div className="flex items-center gap-2 border-b border-white/10 p-4">
                        <Bot className="text-cyan-300" />
                        <b>Portfolio Assistant</b>
                    </div>

                    <div
                        className="flex-1 space-y-3 overflow-y-auto p-4"
                        aria-live="polite"
                    >
                        {items.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[90%] rounded-xl p-3 text-sm ${m.from === "you"
                                    ? "ml-auto bg-violet-600"
                                    : "bg-white/10 text-slate-200"
                                    }`}
                            >
                                {m.text}
                            </div>
                        ))}

                        {busy && (
                            <p className="text-xs text-slate-400">Thinking...</p>
                        )}
                    </div>

                    <form
                        onSubmit={send}
                        className="flex gap-2 border-t border-white/10 p-3"
                    >
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Ask about skills or projects..."
                            aria-label="Ask the portfolio assistant"
                            disabled={busy}
                            className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
                        />

                        <button
                            type="submit"
                            disabled={busy || !q.trim()}
                            aria-label="Send message"
                            className="rounded-lg bg-cyan-500 p-2 text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Send size={17} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
