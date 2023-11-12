import { createGraph, buildAdjacencyList } from "./graph.js";
import createMinHeap from "./minHeap.js";

const dijkstra = (graph, startNode, finishNode) => {
  const adjacencyList = buildAdjacencyList(graph);
  const nodesCount = adjacencyList.length;

  const fringe = new createMinHeap(nodesCount);
  const keys = new Array(nodesCount);
  const parents = new Array(nodesCount);

  fringe.insert(0, 0);
  keys[0] = 0;

  for (let i = 1; i < nodesCount; ++i) {
    fringe.insert(i, Infinity);
    keys[i] = Infinity;
  }

  while (!fringe.isEmpty()) {
    const node = fringe.extractMin();
    const neighbours = adjacencyList[node.key];

    if (node == finishNode) {
      break;
    }

    neighbours.forEach((neighbour) => {
      const newWeight = keys[node.key] + neighbour.weight;
      if (newWeight < keys[neighbour.node]) {
        keys[neighbour.node] = newWeight;
        parents[neighbour.node] = { key: node.key, weight: neighbour.weight };
        fringe.decreaseKey(neighbour.node, newWeight);
      }
    });
  }

  const sp = new Array();
  let node = finishNode;

  while (node != startNode) {
    sp.push({
      from: parents[node].key,
      to: node,
      weight: parents[node].weight,
    });
    node = parents[node].key;
  }

  return {
    steps: sp.reverse(),
    spTotalWeight: keys[finishNode],
  };
};

const displayDijkstraResult = (result) => {
  console.log("SP steps:");

  for (let index = 0; index < result.steps.length; index++) {
    console.log(
      `From ${result.steps[index].from} to ${result.steps[index].to} with weight ${result.steps[index].weight}`,
    );
  }

  console.log(`SP total weight: ${result.spTotalWeight}`);
};

const computeSp = () => {
  console.log("------- SP DIJKSTRA BEGIN -------");

  const graph = new createGraph(
    [0, 1, 2, 3, 4, 5],
    [
      [0, 1, 4],
      [0, 2, 5],
      [1, 2, 11],
      [1, 3, 9],
      [1, 4, 7],
      [2, 4, 3],
      [3, 4, 13],
      [3, 5, 2],
      [4, 5, 6],
    ],
  );

  const result = dijkstra(graph, 0, 5);

  displayDijkstraResult(result);

  console.log("------- SP DIJKSTRA END -------");
};

computeSp();

export default computeSp;
