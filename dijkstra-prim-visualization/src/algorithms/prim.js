import { buildAdjacencyListFromComponent } from "./graph.js";
import createMinHeap from "./minHeap.js";

const prim = (adjacencyList, createFringe) => {
  const nodesCount = adjacencyList.length;

  const fringe = new createFringe(nodesCount);
  const isInFringe = new Array(nodesCount);
  const steps = [];
  const keys = new Array(nodesCount);
  const parents = new Array(nodesCount);

  fringe.insert(0, 0);
  isInFringe[0] = true;
  keys[0] = Infinity;
  for (let index = 1; index < nodesCount; index++) {
    isInFringe[index] = true;
    keys[index] = Infinity;
    fringe.insert(index, Infinity);
  }

  let subSteps = [];
  while (!fringe.isEmpty()) {
    const extractedNode = fringe.extractMin();
    isInFringe[extractedNode.key] = false;

    if (parents[extractedNode.key]) {
      steps.push({
        from: parents[extractedNode.key].key,
        to: extractedNode.key,
        weight: extractedNode.value,
        subSteps: subSteps,
      });
    }

    const neighbors = adjacencyList[extractedNode.key];
    subSteps = [];
    neighbors.forEach((n) => {
      if (isInFringe[n.node]) {
        subSteps.push({
          from: extractedNode.key,
          to: n.node,
          weight: n.weight,
        });

        if (keys[n.node] > n.weight) {
          fringe.decreaseKey(n.node, n.weight);
          parents[n.node] = extractedNode;
          keys[n.node] = n.weight;
        }
      }
    });
  }

  return steps;
};

const transformSteps = (steps) => {
  let total = 0;
  for (let i = 0; i < steps.length; i++) {
    total += steps[i].weight;
  }

  return {
    steps: steps,
    total: total,
  };
};

const primWrapper = (nodes, edges) => {
  const adjacencyList = buildAdjacencyListFromComponent(nodes, edges);
  const steps = prim(adjacencyList, createMinHeap);

  return transformSteps(steps);
};

export { prim, primWrapper };
