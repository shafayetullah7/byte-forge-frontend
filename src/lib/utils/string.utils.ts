/**
 * Generate initials from a name string.
 *
 * @param name - The full name to generate initials from.
 * @returns A string containing up to 2 uppercase initials.
 *
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("Jane") // "J"
 */
export const getInitials = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
