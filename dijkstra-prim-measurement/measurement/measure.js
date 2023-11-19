import fs from "fs";
import path from "path";
import { generateAdjacencyList } from "./dataset.js";
import { prim } from "../../dijkstra-prim-visualization/src/algorithms/prim.js";
import createMinHeap from "../../dijkstra-prim-visualization/src/algorithms/minHeap.js";
import createLinkedList from "../../dijkstra-prim-visualization/src/algorithms/linkedList.js";

const args = process.argv.slice(2);

const config = {
  algorithm: "prim",
  startNodeCount: Number.parseInt(args[0] ?? 1000),
  finishNodeCount: Number.parseInt(args[1] ?? 5000),
  stepNodeCount: Number.parseInt(args[2] ?? 100),
  edgeProbability: 1,
  minEdgeWeight: 1,
  maxEdgeWeght: 15,
  measurementSteps: 10,
};

console.log(config);

const measureTime = (func) => {
  const before = performance.now();
  func();
  const after = performance.now();
  return after - before;
};

const measureAverageTime = (func) => {
  const deltas = [];

  for (
    let measurementStep = 0;
    measurementStep < config.measurementSteps;
    measurementStep++
  ) {
    const delta = measureTime(func);
    deltas.push(delta);
  }

  return Math.floor(deltas.reduce((a, b) => a + b, 0) / deltas.length);
};

const saveResults = (results, fringe) => {
  const directory = "results";

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  const randomTag = (Math.random() + 1).toString(36).substring(7);
  const filename = `${config.algorithm}_${fringe}_${config.startNodeCount}_${config.finishNodeCount}_${config.stepNodeCount}_${config.edgeProbability}_${config.minEdgeWeight}_${config.maxEdgeWeght}_${randomTag}.txt`;

  const writer = fs.createWriteStream(path.join(directory, filename), {
    flags: "w",
  });

  results.forEach((x) => {
    writer.write(`${x.nodesCount} ${x.delta}\n`);
  });

  writer.close();

  return filename;
};

const measure = () => {
  console.log("Started measurement");

  const resultsMinHeap = [];
  const resultsLinkedList = [];

  for (
    let nodesCount = config.startNodeCount;
    nodesCount <= config.finishNodeCount;
    nodesCount += config.stepNodeCount
  ) {
    const adjacencyList = generateAdjacencyList(
      nodesCount,
      config.edgeProbability,
      config.minEdgeWeight,
      config.maxEdgeWeght
    );

    const deltaMinHeap = measureAverageTime(() =>
      prim(adjacencyList, createMinHeap)
    );
    const deltaLinkedList = measureAverageTime(() =>
      prim(adjacencyList, createLinkedList)
    );

    resultsMinHeap.push({
      nodesCount: nodesCount,
      delta: deltaMinHeap,
    });
    resultsLinkedList.push({
      nodesCount: nodesCount,
      delta: deltaLinkedList,
    });

    console.log(
      `Result (min heap): nodesCount = ${nodesCount}, delta = ${deltaMinHeap} ms`
    );
    console.log(
      `Result (linked list): nodesCount = ${nodesCount}, delta = ${deltaLinkedList} ms`
    );
  }

  const filenameMinHeap = saveResults(resultsMinHeap, "minheap");
  const filenameLinkedList = saveResults(resultsLinkedList, "linkedlist");
  console.log(`Saved result to ${filenameMinHeap} and ${filenameLinkedList}`);
};

measure();
