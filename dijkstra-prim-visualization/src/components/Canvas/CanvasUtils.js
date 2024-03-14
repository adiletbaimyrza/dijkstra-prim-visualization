const isTooCloseToExistingNode = (existingNode, newNode) => {
  const x1 = existingNode.x;
  const y1 = existingNode.y;
  const x2 = newNode.x;
  const y2 = newNode.y;

  const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

  return distance <= 42;
};

const newNodePositionValid = (newNode, nodes, setShowErrorModal) => {
  const isTooClose = nodes.some((existingNode) =>
    isTooCloseToExistingNode(existingNode, newNode),
  );

  if (isTooClose) {
    setShowErrorModal({
      show: true,
      text: "New node is too close to an existing node.",
    });
    return false;
  }

  return true;
};

const newEdgeValid = (newEdge, edges, setShowErrorModal) => {
  const edgeExists = edges.some(
    (edge) =>
      (edge.firstNode.x === newEdge.firstNode.x &&
        edge.firstNode.y === newEdge.firstNode.y &&
        edge.secondNode.x === newEdge.secondNode.x &&
        edge.secondNode.y === newEdge.secondNode.y) ||
      (edge.firstNode.x === newEdge.secondNode.x &&
        edge.firstNode.y === newEdge.secondNode.y &&
        edge.secondNode.x === newEdge.firstNode.x &&
        edge.secondNode.y === newEdge.firstNode.y),
  );

  if (edgeExists) {
    setShowErrorModal({
      show: true,
      text: "An edge with the same coordinates already exists.",
    });
    return false;
  }

  return true;
};

export { newNodePositionValid, newEdgeValid };
