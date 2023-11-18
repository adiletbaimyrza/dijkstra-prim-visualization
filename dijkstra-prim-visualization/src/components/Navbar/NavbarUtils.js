import { createGraphFromComponent } from "../../algorithms/graph";
import prim from "../../algorithms/mstPrim";
import dijkstra from "../../algorithms/spDijkstra";

const runPrim = (nodes, edges) => {
  const graph = createGraphFromComponent(nodes, edges);
  const result = prim(graph);
  console.log(result);
  result.steps.shift(); // TODO: fix it
  const edgeIds = getEdgeIDs(result.steps);

  return edgeIds;
};

const runDijkstra = (nodes, edges) => {
  const graph = createGraphFromComponent(nodes, edges);
  const result = dijkstra(graph);
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

export { runPrim, runDijkstra };
