import {
  buildAdjacencyList,
  buildAdjacencyListFromComponent,
} from "./graph.js";
import createMinHeap from "./minHeap.js";

const prim = (adjacencyList, createFringe) => {
  const nodesCount = adjacencyList.length;

  const fringe = new createFringe(nodesCount);
  const isInHeap = new Array(nodesCount);
  const results = new Array(nodesCount);
  const keys = new Array(nodesCount);

  // Insert node 0 with value 0
  fringe.insert(0, 0);
  isInHeap[0] = true;
  keys[0] = Infinity;
  results[0] = {
    parent: -1,
    weight: null,
  };

  for (let index = 1; index < nodesCount; index++) {
    isInHeap[index] = true;
    keys[index] = Infinity;
    fringe.insert(index, Infinity);
  }

  while (!fringe.isEmpty()) {
    const extractedNode = fringe.extractMin();
    isInHeap[extractedNode.key] = false;

    const neightbours = adjacencyList[extractedNode.key];
    neightbours.forEach((n) => {
      if (isInHeap[n.node]) {
        if (keys[n.node] > n.weight) {
          fringe.decreaseKey(n.node, n.weight);
          keys[n.node] = n.weight;
          results[n.node] = {
            from: extractedNode.key,
            to: n.node,
            weight: n.weight,
          };
        }
      }
    });
  }

  results.shift(1);

  results.sort((a, b) => a.weight - b.weight);

  let mstTotal = 0;

  for (let index = 0; index < nodesCount - 1; index++) {
    mstTotal += results[index].weight;
  }

  return {
    steps: results,
    mstTotalWeight: mstTotal,
  };
};

const primWrapper = (nodes, edges) => {
  const adjacencyList = buildAdjacencyListFromComponent(nodes, edges);
  return prim(adjacencyList, createMinHeap);
};

const displayPrimResult = (result) => {
  console.log("MST steps:");

  for (let index = 0; index < result.steps.length; index++) {
    console.log(
      `From ${result.steps[index].from} to ${result.steps[index].to} with weight ${result.steps[index].weight}`,
    );
  }

  console.log(`MST total weight: ${result.mstTotalWeight}`);
};

const computeMst = () => {
  console.log("------- MST PRIM BEGIN -------");

  const graph = new createGraph(
    [0, 1, 2, 3, 4],
    [
      [0, 1, 5],
      [0, 2, 1],
      [0, 3, 5],
      [1, 2, 3],
      [1, 4, 4],
      [2, 4, 8],
      [3, 4, 9],
    ],
  );

  const adjacencyList = buildAdjacencyList(graph);

  const result = prim(adjacencyList);

  displayPrimResult(result);

  console.log("------- MST PRIM END -------");
};

export { prim, primWrapper };
