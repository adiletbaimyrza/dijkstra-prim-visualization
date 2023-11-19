import fs from "fs";
import path from "path";
import { createAdjacencyListEntry } from "../../dijkstra-prim-visualization/src/algorithms/graph.js";

const directory = "datasets";

const generateRandomNumber = (a, b) => Math.floor(Math.random() * (b - a) + a);

const generateAdjacencyList = (
  nodesCount,
  probability,
  minWeight,
  maxWeight
) => {
  const adjacencyList = new Array(nodesCount);

  for (let i = 0; i < nodesCount; i++) {
    adjacencyList[i] = new Array();
  }

  for (let i = 0; i < nodesCount; i++) {
    for (let j = i + 1; j < nodesCount; j++) {
      if (Math.random() < probability) {
        const weight = generateRandomNumber(minWeight, maxWeight);
        adjacencyList[i].push(createAdjacencyListEntry(j, weight));
        adjacencyList[j].push(createAdjacencyListEntry(i, weight));
      }
    }
  }

  return adjacencyList;
};

const ensureDirectoryExists = () => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
};

const generateFilePath = (nodesCount) =>
  path.join(directory, `al_${nodesCount}.txt`);

const saveAdjacencyList = (dataset) => {
  ensureDirectoryExists();
  const writer = fs.createWriteStream(generateFilePath(dataset.length), {
    flags: "w",
  });

  writer.write(`${dataset.length}\n`);

  dataset.forEach((row) => {
    row.forEach((element) => {
      const chunk = `${element.node},${element.weight} `;
      writer.write(chunk);
    });
    writer.write("\n");
  });

  writer.close();
};

const readAdjacencyList = (nodesCount) => {
  ensureDirectoryExists();
  const rawDataset = fs.readFileSync(generateFilePath(nodesCount), "utf-8");

  const lines = rawDataset.trim().split("\n");

  const adjacencyList = new Array(nodesCount);

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i]
      .trim()
      .split(" ")
      .map((chunk) => {
        const [node, weight] = chunk.split(",");
        return createAdjacencyListEntry(
          Number.parseInt(node),
          Number.parseInt(weight)
        );
      });
    adjacencyList[i - 1] = row;
  }

  return adjacencyList;
};

const getDatasets = () => {
  ensureDirectoryExists();
  const datasets = fs.readdirSync(directory);
  return datasets
    .map((x) => Number.parseInt(x.replace(/^al_/, "").replace(/.txt$/)))
    .sort((a, b) => a - b);
};

export {
  generateAdjacencyList,
  saveAdjacencyList,
  readAdjacencyList,
  getDatasets,
};
