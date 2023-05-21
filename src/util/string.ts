const nonAccentPattern = /\P{Mn}|̈/u;

export const stripAccents = (s: string) => s
    .normalize("NFKD")
    .split("")
    .filter((c: string) => nonAccentPattern.test(c))
    .join("")
    .normalize();

export const isLowerCase = (s: string) => s.toLowerCase() === s;

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
