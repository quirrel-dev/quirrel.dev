export function isValidSlug(slug: string): boolean {
  return /^[\w\d-]+$/.test(slug)
}
