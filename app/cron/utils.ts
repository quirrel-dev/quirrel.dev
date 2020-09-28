export function getBeginningOfCurrentMonth(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), 1)
}
