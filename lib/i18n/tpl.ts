/**
 * Minimal `{placeholder}` interpolation. Dictionary values must stay plain
 * (JSON-serialisable) strings because they cross the server→client boundary, so
 * any runtime values (amounts, ages, percentages) are spliced in at the call
 * site rather than via functions stored in the dictionary.
 */
export function tpl(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? String(vars[key]) : `{${key}}`));
}
