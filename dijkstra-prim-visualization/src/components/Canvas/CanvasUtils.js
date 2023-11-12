/**
 * Calculates the Euclidean distance between two points.
 * @param {Object} existingNode - The coordinates of an existing node.
 * @param {Object} newNode - The coordinates of a new node.
 * @returns {boolean} - Returns true if the distance is less than or equal to 35px, false otherwise.
 */
const isTooCloseToExistingNode = (existingNode, newNode) => {
  const x1 = existingNode.x;
  const y1 = existingNode.y;
  const x2 = newNode.x;
  const y2 = newNode.y;

  const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

  return distance <= 35;
};

/**
 * Checks if a new node is within the bounds of the canvas.
 * @param {Object} newNode - The coordinates of the new node.
 * @param {number} nodeRadius - The radius of the node.
 * @param {Object} canvasRef - A reference to the canvas element.
 * @returns {boolean} - Returns true if the new node is within the bounds of the canvas, false otherwise.
 */
const isNodeInBounds = (newNode, nodeRadius, canvasRef) => {
  return (
    newNode.x - nodeRadius >= 0 &&
    newNode.y - nodeRadius >= 0 &&
    newNode.x + nodeRadius <= canvasRef.current.clientWidth &&
    newNode.y + nodeRadius <= canvasRef.current.clientHeight
  );
};

/**
 * Checks if a new node position is valid.
 * @param {Object} newNode - The coordinates of the new node.
 * @param {Array} nodes - An array of existing node coordinates.
 * @param {Object} canvasRef - A reference to the canvas element.
 * @returns {boolean} - Returns true if the new node position is valid, false otherwise.
 */
export const newNodePositionValid = (newNode, nodes, canvasRef) => {
  const isTooClose = nodes.some((existingNode) =>
    isTooCloseToExistingNode(existingNode, newNode),
  );

  if (isTooClose) {
    console.log("New node is too close to an existing node.");
    return false;
  }

  const isOutOfBounds = !isNodeInBounds(newNode, 14, canvasRef);

  if (isOutOfBounds) {
    console.log("New node is out of bounds.");
    return false;
  }

  return true;
};

/**
 * Checks if a new edge is valid.
 * @param {Object} newEdge - The coordinates of the new edge.
 * @param {Array} edges - An array of existing edge coordinates.
 * @returns {boolean} - Returns true if the new edge is valid, false otherwise.
 */
export const newEdgeValid = (newEdge, edges) => {
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
    console.log("An edge with the same coordinates already exists.");
    return false;
  }

  return true;
};
