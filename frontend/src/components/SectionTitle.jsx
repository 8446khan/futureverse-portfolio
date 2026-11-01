
export default function SectionTitle({ eyebrow, title, accent }) {
    return (
        <div className="mb-8">
            <p className="mb-2 text-[11px] font-bold tracking-[0.22em] text-cyan-400 sm:text-xs">
                {eyebrow}
            </p>

            <h2 className="text-2xl font-black leading-tight sm:text-3xl lg:text-[38px]">
                {title}{" "}
                <span className="gradient-text">{accent}</span>
            </h2>
        </div>
    );
}
