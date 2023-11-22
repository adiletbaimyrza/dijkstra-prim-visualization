import { primWrapper } from "../../algorithms/prim";
import { dijkstraWrapper } from "../../algorithms/dijkstra";

const runPrim = (nodes, edges) => {
  const result = primWrapper(nodes, edges);
  return transfromResultToAnimation(result);
};

const runDijkstra = (nodes, edges) => {
  const result = dijkstraWrapper(nodes, edges);
  return transfromResultToAnimation(result);
};

const getEdgeId = (nodeId1, nodeId2) => {
  const edgeCandidateOne = document.getElementById(`${nodeId1}-${nodeId2}`);

  return edgeCandidateOne ? `${nodeId1}-${nodeId2}` : `${nodeId2}-${nodeId1}`;
};

const transfromResultToAnimation = (result) => {
  return {
    animations: result.steps.map((step) => {
      return {
        selectedEdgeId: getEdgeId(step.from, step.to),
        edgeIds: step.subSteps.map((subStep) =>
          getEdgeId(subStep.from, subStep.to),
        ),
        weight: step.weight,
      };
    }),
    total: result.total,
  };
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
