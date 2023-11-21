// const createGraphFromComponent = function (nodes, edges) {
//   const mappedNodes = nodes.map((node) => node.id);
//   const mappedEdges = edges.map((edge) => {
//     return [edge.firstNode.id, edge.secondNode.id, edge.weight];
//   });

//   return new createGraph(mappedNodes, mappedEdges);
// };

const createAdjacencyListEntry = (node, weight) => {
  const entry = {
    node: node,
    weight: weight,
  };
  return entry;
};

const createGraph = function (nodes, edges) {
  this.nodes = nodes;
  this.edges = new Array(edges.length);

  for (let index = 0; index < edges.length; index++) {
    const [from, to, weight] = edges[index];
    this.edges[index] = {
      from: from,
      to: to,
      weight: weight,
    };
  }
};

const buildAdjacencyList = (graph) => {
  const adjacencyList = new Array(graph.nodes.length).fill(null);

  graph.edges.forEach((e) => {
    if (!Array.isArray(adjacencyList[e.from])) {
      adjacencyList[e.from] = new Array();
    }
    adjacencyList[e.from].push(createAdjacencyListEntry(e.to, e.weight));

    if (!Array.isArray(adjacencyList[e.to])) {
      adjacencyList[e.to] = new Array();
    }
    adjacencyList[e.to].push(createAdjacencyListEntry(e.from, e.weight));
  });

  return adjacencyList;
};

const buildAdjacencyListFromComponent = (nodes, edges) => {
  const adjacencyList = new Array(nodes.length).fill(null);

  edges
    .map((e) => {
      return {
        from: e.firstNode.id,
        to: e.secondNode.id,
        weight: e.weight,
      };
    })
    .forEach((e) => {
      if (!Array.isArray(adjacencyList[e.from])) {
        adjacencyList[e.from] = new Array();
      }
      adjacencyList[e.from].push(createAdjacencyListEntry(e.to, e.weight));

      if (!Array.isArray(adjacencyList[e.to])) {
        adjacencyList[e.to] = new Array();
      }
      adjacencyList[e.to].push(createAdjacencyListEntry(e.from, e.weight));
    });

  return adjacencyList;
};

export {
  createAdjacencyListEntry,
  createGraph,
  buildAdjacencyList,
  buildAdjacencyListFromComponent,
};
