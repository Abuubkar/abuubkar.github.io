export function SectionHeading({
  id,
  title,
  subtitle,
}: {
  id?: string;
  title: string;
  /** Muted one-line description under the title */
  subtitle?: string;
}) {
  return (
    <header className="mb-10">
      {/* Anchor offset so the fixed top nav doesn't clip the heading */}
      {id && <span id={id} className="block -translate-y-20" aria-hidden />}
      <h2 className="text-headline-lg text-on-surface">{title}</h2>
      {subtitle && (
        <p className="text-body-md text-on-surface-variant mt-3 max-w-2xl">
          {subtitle}
        </p>
      )}
    </header>
  );
}
