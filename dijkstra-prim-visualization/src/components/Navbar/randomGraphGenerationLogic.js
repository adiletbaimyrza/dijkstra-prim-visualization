const getRandomGraph = (setEdges, setNodes, nodesRange, weightRange) => {
  const canvas = document.getElementById("canvas").getBoundingClientRect();

  //pick number of nodes
  const minNodes = nodesRange[0];
  const maxNodes = nodesRange[1];
  const numberOfNodes =
    Math.floor(Math.random() * (maxNodes - minNodes + 1)) + minNodes;

  const nodes = [];
  const edges = [];

  const centerXs = [
    canvas.width / 6,
    canvas.width - canvas.width / 5,
    canvas.width / 2,
    canvas.width / 5,
    canvas.width - canvas.width / 6,
  ];

  const centerYs = [
    canvas.height / 5,
    canvas.height / 5,
    canvas.height / 2,
    canvas.height - canvas.height / 5,
    canvas.height - canvas.height / 5,
  ];

  let id = 0;
  let nodesPerCircle = Math.floor(numberOfNodes / 5);
  let mod = numberOfNodes % 5;
  let start = Math.floor(Math.random() * 5);

  //generate nodes
  for (let i = 0; i < 5; ++i) {
    const fullCircle = 6.2;
    let angle = Math.random() * fullCircle;
    const maxDiff = fullCircle / (numberOfNodes / 5.0);
    const minDiff = 1.0;
    for (let j = 0; j < nodesPerCircle + (mod > 0); ++j) {
      angle += Math.random() * (maxDiff - minDiff) + minDiff;
      let x = centerXs[(i + start) % 5] + Math.cos(angle) * canvas.width * 0.1;
      let y = centerYs[(i + start) % 5] + Math.sin(angle) * canvas.height * 0.1;

      nodes.push({
        id: id++,
        x: x,
        y: y,
      });
    }
    mod--;
  }

  //generate edges
  const base = Math.floor(Math.random() * nodes.length);
  for (let i = 0; i < nodes.length; ++i) {
    let probability = 1.0;
    for (let j = 0; j < nodes.length; ++j) {
      if (Math.random() <= probability && i != j) {
        const weight = Math.floor(Math.random() * weightRange[1]) + 1;
        const firstNode = nodes[(base + i) % nodes.length];
        const secondNode = nodes[(base + j) % nodes.length];

        let goodEdge = true;
        for (let k = 0; k < edges.length; ++k) {
          let edge = edges[k];

          //check if the edge is a duplicate
          if (
            firstNode.id == edge.secondNode.id &&
            secondNode.id == edge.firstNode.id
          ) {
            goodEdge = false;
            break;
          }

          //check if the edge intersects another edge
          const det =
            (secondNode.x - firstNode.x) *
              (edge.secondNode.y - edge.firstNode.y) -
            (edge.secondNode.x - edge.firstNode.x) *
              (secondNode.y - firstNode.y);

          if (det !== 0) {
            const lambda =
              ((edge.secondNode.y - edge.firstNode.y) *
                (edge.secondNode.x - firstNode.x) +
                (edge.firstNode.x - edge.secondNode.x) *
                  (edge.secondNode.y - firstNode.y)) /
              det;
            const gamma =
              ((firstNode.y - secondNode.y) *
                (edge.secondNode.x - firstNode.x) +
                (secondNode.x - firstNode.x) *
                  (edge.secondNode.y - firstNode.y)) /
              det;

            if (0 < lambda && lambda < 1 && 0 < gamma && gamma < 1) {
              goodEdge = false;
              break;
            }
          }
        }

        //check if the edge intersects another node
        for (let k = 0; k < numberOfNodes; ++k) {
          if (nodes[k].id == firstNode.id || nodes[k].id == secondNode.id) {
            continue;
          }
          let dxL = secondNode.x - firstNode.x,
            dyL = secondNode.y - firstNode.y;
          let dxP = nodes[k].x - firstNode.x,
            dyP = nodes[k].y - firstNode.y;

          let squareLen = dxL * dxL + dyL * dyL;
          let dotProd = dxP * dxL + dyP * dyL;
          let crossProd = dyP * dxL - dxP * dyL;

          var distance = Math.abs(crossProd) / Math.sqrt(squareLen);

          if (distance <= 40 && dotProd >= 0 && dotProd <= squareLen) {
            goodEdge = false;
            break;
          }
        }

        //add an edge
        if (goodEdge) {
          probability /= 4.0;
          edges.push({
            id: firstNode.id + "-" + secondNode.id,
            weight: weight,
            firstNode: firstNode,
            secondNode: secondNode,
          });
        }
      }
    }
  }

  setNodes(nodes);
  setEdges(edges);
};

export default getRandomGraph;
