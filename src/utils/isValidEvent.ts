export const syntheticEvents = new WeakSet<MouseEvent>()

export const isValidEvent = (event: any) => {
  if (syntheticEvents.has(event)) return false

  return true
}
