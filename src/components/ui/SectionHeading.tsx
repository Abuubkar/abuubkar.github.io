export function SectionHeading({
  id,
  num,
  slug,
  title,
  subtitle,
}: {
  id?: string;
  /** Hex index, e.g. "0x01" */
  num: string;
  /** Comment slug, e.g. "technical-arsenal" */
  slug: string;
  title: string;
  /** Muted one-line description under the title */
  subtitle?: string;
}) {
  return (
    <header className="mb-10">
      {/* Anchor offset so the fixed top nav doesn't clip the heading */}
      {id && <span id={id} className="block -translate-y-20" aria-hidden />}
      <p className="text-code-sm mb-4 text-on-surface-variant">
        <span className="text-primary">{num}</span>{" "}
        <span aria-hidden>//</span> {slug}
      </p>
      <h2 className="text-headline-lg text-on-surface">{title}</h2>
      {subtitle && (
        <p className="text-body-md text-on-surface-variant mt-3 max-w-2xl">
          {subtitle}
        </p>
      )}
    </header>
  );
}
