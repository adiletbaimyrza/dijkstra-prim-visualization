import { primWrapper } from "../../algorithms/prim";
import { dijkstraWrapper } from "../../algorithms/dijkstra";

const runPrim = (nodes, edges) => {
  const stepsWithRawIds = primWrapper(nodes, edges);
  return transformRawIds(stepsWithRawIds, "prim");
};

const runDijkstra = (nodes, edges) => {
  const stepsWithRawIds = dijkstraWrapper(nodes, edges);
  return transformRawIds(stepsWithRawIds, "dijkstra");
};

const getEdgeId = (nodeId1, nodeId2) => {
  const edgeCandidateOne = document.getElementById(`${nodeId1}-${nodeId2}`);
  return edgeCandidateOne ? `${nodeId1}-${nodeId2}` : `${nodeId2}-${nodeId1}`;
};

const createStepsWithIds = (stepsWithRawIds) => {
  return stepsWithRawIds.steps.map((step) => {
    const checkedEdgeIds = step.subSteps.map((subStep) =>
      getEdgeId(subStep.from, subStep.to),
    );

    return {
      selectedEdgeId: getEdgeId(step.from, step.to),
      checkedEdgeIds,
      weight: step.weight,
    };
  });
};

const transformRawIds = (stepsWithRawIds, algorithmType) => {
  if (!["dijkstra", "prim"].includes(algorithmType)) {
    console.error("ERROR: Invalid algorithmType");
    return;
  }

  const stepsWithIds = createStepsWithIds(stepsWithRawIds);

  switch (algorithmType) {
    case "dijkstra":
      const shortestPath = stepsWithRawIds.shortestPath.map((rawEdgeId) => {
        return {
          selectedEdgeId: getEdgeId(rawEdgeId.from, rawEdgeId.to),
          weight: rawEdgeId.weight,
        };
      });

      return {
        algorithmType,
        stepsWithIds,
        shortestPath,
        total: stepsWithRawIds.total,
      };
    case "prim":
      return {
        algorithmType,
        stepsWithIds,
        total: stepsWithRawIds.total,
      };
  }
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
