export function SectionTitle({ eyebrow, title, description, align = "start" }) {
  const alignmentClass =
    align === "center" ? "text-center" : align === "end" ? "text-end" : "text-start";

  return (
    <div className={alignmentClass}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-bold text-[var(--ui-text-primary)] sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-2xl me-auto text-sm leading-7 text-[var(--ui-text-muted)]">{description}</p>
      ) : null}
    </div>
  );
}
