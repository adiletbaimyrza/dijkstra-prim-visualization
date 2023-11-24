import { useContext } from "react";
import { GraphParamsContext } from "../../contexts/GraphParamsContext";
import { ErrorModalContext } from "../../contexts/ModalsContext";
import { startAnimation } from "./animations";
import { runDijkstra, runPrim, areAllNodesConnected } from "./NavbarUtils";
import styles from "./Navbar.module.css";
import PaperModal from "../Modals/PaperModal/PaperModal";
import { createPortal } from "react-dom";

/**
 * Navbar component displays buttons to manage all the logic of the website.
 * @returns {JSX.Element} Navbar component
 */
const Navbar = () => {
  const { nodes, edges, setNodes, setEdges } = useContext(GraphParamsContext);
  const { setShowErrorModal, showPaperModal, setShowPaperModal } =
    useContext(ErrorModalContext);

  const animatePrim = () => {
    if (areAllNodesConnected(nodes, edges)) {
      const animation = runPrim(nodes, edges);
      console.log(animation);
      startAnimation(animation);
    } else {
      setShowErrorModal({
        show: true,
        text: "All nodes must be connected.",
      });
    }
  };

  const animateDijkstra = () => {
    if (areAllNodesConnected(nodes, edges)) {
      const animation = runDijkstra(nodes, edges);
      console.log(animation);
      startAnimation(animation);
    } else {
      setShowErrorModal({
        show: true,
        text: "All nodes must be connected.",
      });
    }
  };

  const resetEdgesAndNodes = () => {
    setNodes([]);
    setEdges([]);
  };

  const generateRandomGraph = () => {
    const generateRandomNumber = (min, max) =>
      Math.floor(Math.random() * (max - min) + min);

    const generateGraph = (nodesCount, probability, minWeight, maxWeight) => {
      const nodes = [...Array(nodesCount).keys()].map((x) => {
        return {
          id: x,
        };
      });

      const edges = [];

      d3.shuffle(nodes);

      for (let i = 0; i < nodesCount - 1; i++) {
        const edge = {
          from: nodes[i].id,
          to: nodes[i + 1].id,
          weight: generateRandomNumber(minWeight, maxWeight),
        };
        edges.push(edge);
        console.log(edge);
      }

      console.log(`---------- after this goes probability ${probability} ---------------`);

      for (let i = 0; i < nodesCount; i++) {
        for (let j = i + 1; j < nodesCount; j++) {
          if (
            Math.random() < probability &&
            !edges.some(
              (edge) =>
                (edge.from == i && edge.to == j) ||
                (edge.from == j && edge.to == i),
            )
          ) {
            const edge = {
              from: i,
              to: j,
              weight: generateRandomNumber(minWeight, maxWeight),
            };
            edges.push(edge);
            console.log(edge);
          }
        }
      }

      return {
        nodes: nodes,
        edges: edges,
      };
    };

    const nodesCount = generateRandomNumber(7, 10);

    const graph = generateGraph(nodesCount, 0, 5, 15);

    const canvasWidth = 2000;
    const canvasHeight = 1000;

    // Calculate the initial positions of nodes (simple grid layout)
    const gridSize =
      Math.min(canvasWidth, canvasHeight) / Math.sqrt(graph.nodes.length);

    // graph.nodes.forEach((node, index) => {
    //   node.x =
    //     (index % Math.floor(canvasWidth / gridSize)) * gridSize + gridSize / 2;
    //   node.y =
    //     Math.floor(index / (canvasWidth / gridSize)) * gridSize + gridSize / 2;
    // });

    // Optional: Adjust node positions based on links (centered layout)
    graph.edges.forEach((edge) => {
      const fromNode = graph.nodes.find((node) => node.id === edge.from);
      const toNode = graph.nodes.find((node) => node.id === edge.to);

      // Move nodes closer to the center of the link
      // fromNode.x += (toNode.x - fromNode.x) * 0.2;
      // fromNode.y += (toNode.y - fromNode.y) * 0.2;
      // toNode.x += (fromNode.x - toNode.x) * 0.2;
      // toNode.y += (fromNode.y - toNode.y) * 0.2;
    });

    graph.edges = graph.edges.map((edge) => {
      const fromNode = graph.nodes.find((node) => node.id === edge.from);
      const toNode = graph.nodes.find((node) => node.id === edge.to);

      return {
        id: `${edge.from}-${edge.to}`,
        weight: edge.weight,
        firstNode: fromNode,
        secondNode: toNode,
      };
    });

    // d3.shuffle(graph.nodes);

    const d3nodes = graph.nodes.map((x) => {
      return {
        id: x.id,
      };
    });

    const d3links = graph.edges.map((x) => {
      return {
        source: x.firstNode.id,
        target: x.secondNode.id,
      };
    });

    // Now, the nodes array contains the (x, y) coordinates for each node

    const randomStrengths = [-3200, -3000, -2500, -2000];

    const simulation = d3
      .forceSimulation(d3nodes)
      .force(
        "link",
        d3.forceLink(d3links).id((d) => d.id),
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(
            randomStrengths[generateRandomNumber(0, randomStrengths.length)],
          ),
      )
      .force("center", d3.forceCenter(500, 500));

    // Run the simulation for a certain number of ticks
    simulation.tick(1); // You can adjust the number of ticks

    // Access the final coordinates of nodes
    d3nodes.forEach((d3node) => {
      const node = graph.nodes.find((x) => x.id == d3node.id);
      node.x = d3node.x;
      node.y = d3node.y;
    });

    console.log(graph);

    while (true) {
      const disconnectedNode = graph.nodes.find(
        (node) =>
          !graph.edges.some(
            (edge) =>
              edge.firstNode.id == node.id || edge.secondNode.id == node.id,
          ),
      );

      if (disconnectedNode) {
        const nextNodeIndex = (disconnectedNode.id + 1) % graph.nodes.length;
        const nextNode = graph.nodes.find((x) => x.id == nextNodeIndex);
        const newEdge = {
          id: `${nextNode.id}-${disconnectedNode.id}`,
          weight: generateRandomNumber(5, 15),
          firstNode: nextNode,
          secondNode: disconnectedNode,
        };
        graph.edges.push(newEdge);
        console.log(newEdge);
      } else {
        break;
      }
    }

    console.log(graph);

    setNodes(graph.nodes);
    setEdges(graph.edges);
  };

  return (
    <>
      <div className={styles.Navbar}>
        <button onClick={animatePrim}>Run prim's algorithm</button>
        <button onClick={animateDijkstra}>Run dijkstra's algorithm</button>
        <button id={styles.clearCanvas} onClick={resetEdgesAndNodes}>
          Clear canvas
        </button>
        <button id={styles.clearCanvas} onClick={generateRandomGraph}>
          Random graph
        </button>
        <button onClick={() => setShowPaperModal(true)}>Paper</button>
      </div>

      {showPaperModal &&
        createPortal(
          <PaperModal onClose={() => setShowPaperModal(false)} />,
          document.body,
        )}
    </>
  );
};

export default Navbar;
