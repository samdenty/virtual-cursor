export const nodeFromPoint = (x: number, y: number) => {
  try {
    let el = document.elementFromPoint(x, y)
    let nodes = el.childNodes

    for (let i = 0, n; (n = nodes[i++]); ) {
      if (n.nodeType === 3) {
        let r = document.createRange()
        r.selectNode(n)
        let rects = r.getClientRects()
        for (let j = 0, rect; (rect = rects[j++]); ) {
          if (
            x > rect.left &&
            x < rect.right &&
            y > rect.top &&
            y < rect.bottom
          ) {
            return n
          }
        }
      }
    }
    return el
  } catch (e) {
    return null
  }
}
