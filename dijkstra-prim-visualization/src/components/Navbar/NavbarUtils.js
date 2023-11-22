import { primWrapper } from "../../algorithms/prim";
import { dijkstraWrapper } from "../../algorithms/dijkstra";

const runPrim = (nodes, edges) => {
  const result = primWrapper(nodes, edges);
  console.log(result);
  const edgeIds = getEdgeIDs(result.steps);

  return edgeIds;
};

const runDijkstra = (nodes, edges) => {
  const result = dijkstraWrapper(nodes, edges);
  console.log(result);
  const edgeIds = getEdgeIDs(result.steps);

  return edgeIds;
};

/**
 * Returns an array of edge IDs based on the given steps.
 * @param {Array} steps - The steps array.
 * @returns {Array} - The array of edge IDs.
 */
const getEdgeIDs = (steps) => {
  if (!Array.isArray(steps)) {
    console.error("Invalid argument: steps must be an array");
    return;
  }

  return steps.map((step) => {
    const edgeCandidateOne = document.getElementById(`${step.from}-${step.to}`);

    return edgeCandidateOne
      ? `${step.from}-${step.to}`
      : `${step.to}-${step.from}`; // edgeCandidateTwo
  });
};

const isNodeConnected = (node, edges) => {
  return edges.some(
    (edge) => edge.firstNode.id === node.id || edge.secondNode.id === node.id,
  );
};

const areAllNodesConnected = (nodes, edges) => {
  return nodes.every((node) => isNodeConnected(node, edges));
};

export { areAllNodesConnected, runPrim, runDijkstra };
