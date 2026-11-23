export const CABRILLO_ACCESS_SOURCE: string;
export function accessClosure(slug: string | undefined, date: string): string | null;
export function visitWindows<T extends { date: string }>(slug: string | undefined, windows: T[]): T[];
