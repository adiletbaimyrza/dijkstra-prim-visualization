import { generateAdjacencyList, saveAdjacencyList } from "./dataset.js";

const args = process.argv.slice(2);

console.log(args);

const startNodeCount = Number.parseInt(args[0] ?? 1000);
const finishNodeCount = Number.parseInt(args[1] ?? 5000);
const stepNodeCount = Number.parseInt(args[2] ?? 100);

const edgeProbability = 0.5;

const minEdgeWeight = 1;
const maxEdgeWeght = 15;

for (
  let nodesCount = startNodeCount;
  nodesCount <= finishNodeCount;
  nodesCount += stepNodeCount
) {
  const dataset = generateAdjacencyList(
    nodesCount,
    edgeProbability,
    minEdgeWeight,
    maxEdgeWeght
  );
  saveAdjacencyList(dataset);
  console.log(
    `Prepared an adjacency list for ${nodesCount} nodes with edge probability of ${edgeProbability}`
  );
}
