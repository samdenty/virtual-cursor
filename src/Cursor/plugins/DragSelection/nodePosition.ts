export const isNodeFollowing = (followingNode: Node, target: Node) =>
  !!(
    target.compareDocumentPosition(followingNode) &
    Node.DOCUMENT_POSITION_FOLLOWING
  )
