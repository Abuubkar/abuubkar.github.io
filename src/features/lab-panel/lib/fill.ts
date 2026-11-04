/** Fill `{name}` placeholders in a copy string from src/config/site.ts. */
export const fill = (
  template: string,
  values: Record<string, string | number>,
) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );
