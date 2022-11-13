// We don't need "classnames"!
export function cn(...args: (string | null | undefined | false)[]): string {
  return args.filter(Boolean).join(" ");
}
