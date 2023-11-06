import createMinHeap from "./minHeap";

const computeMst = () => {
  console.log("------- MST PRIM BEGIN -------");

  const createAdjacencyListEntry = (node, weight) => {
    const entry = {
      node: node,
      weight: weight,
    };
    return entry;
  };

  const createEdge = (node1, node2, weight) => {
    const edge = {
      node1: node1,
      node2: node2,
      weight: weight,
    };
    return edge;
  };

  const graph = {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      createEdge(0, 1, 5),
      createEdge(0, 2, 1),
      createEdge(0, 3, 5),
      createEdge(1, 2, 3),
      createEdge(1, 4, 4),
      createEdge(2, 4, 8),
      createEdge(3, 4, 9),
    ],
  };

  const createAdjacencyList = (graph) => {
    const adjacencyList = new Array(graph.nodes.length).fill(null);

    graph.edges.forEach((e) => {
      if (!Array.isArray(adjacencyList[e.node1])) {
        adjacencyList[e.node1] = new Array();
      }
      adjacencyList[e.node1].push(createAdjacencyListEntry(e.node2, e.weight));

      if (!Array.isArray(adjacencyList[e.node2])) {
        adjacencyList[e.node2] = new Array();
      }
      adjacencyList[e.node2].push(createAdjacencyListEntry(e.node1, e.weight));
    });

    return adjacencyList;
  };

  const adjacencyList = createAdjacencyList(graph);

  const nodesCount = adjacencyList.length;

  console.log(adjacencyList);

  let fringe = new createMinHeap(nodesCount);

  const isInHeap = new Array(nodesCount);
  const results1 = new Array(nodesCount);

  const keys = new Array(nodesCount);

  isInHeap[0] = true;
  keys[0] = Infinity;
  results1[0] = {
    parent: -1,
    weight: null,
  };
  fringe.insert(0, 0);

  for (let index = 0; index < nodesCount; index++) {
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
          results1[n.node] = {
            from: extractedNode.key,
            to: n.node,
            weight: n.weight,
          };
        }
      }
    });
  }

  results1.sort((a, b) => a.weight - b.weight);

  let mstTotal = 0;

  for (let index = 1; index < nodesCount; index++) {
    console.log(
      `Edge: ${results1[index].from} to\t ${results1[index].to}\tweight ${results1[index].weight}`,
    );
    mstTotal += results1[index].weight;
  }

  console.log(`Total: ${mstTotal}`);

  console.log("------- MST PRIM END -------");
};

export default computeMst;
