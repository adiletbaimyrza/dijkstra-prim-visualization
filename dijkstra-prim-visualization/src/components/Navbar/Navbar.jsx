import { useContext, useState } from "react";
import { GraphParamsContext } from "../../contexts/GraphParamsContext";
import { ErrorModalContext } from "../../contexts/ModalsContext";
import { startAnimations } from "./animations";
import { runDijkstra, runPrim, areAllNodesConnected } from "./NavbarUtils";
import styles from "./Navbar.module.css";
import PaperModal from "../Modals/PaperModal/PaperModal";
import { createPortal } from "react-dom";
import graphs from "../../assets/graphs/graphs";

const Navbar = () => {
  const { nodes, edges, setNodes, setEdges } = useContext(GraphParamsContext);
  const { setShowErrorModal, showPaperModal, setShowPaperModal } =
    useContext(ErrorModalContext);

  const [graphIndex, setGraphIndex] = useState(0);

  const animatePrim = () => {
    if (areAllNodesConnected(nodes, edges)) {
      const animationsData = runPrim(nodes, edges);
      startAnimations(animationsData);
    } else {
      setShowErrorModal({
        show: true,
        text: "All nodes must be connected.",
      });
    }
  };

  const animateDijkstra = () => {
    if (areAllNodesConnected(nodes, edges)) {
      const animationsData = runDijkstra(nodes, edges);
      startAnimations(animationsData);
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

  const recordGraph = () => {
    const canvas = document
      .getElementsByTagName("svg")[0]
      .getBoundingClientRect();

    const graph = {
      canvas: {
        height: canvas.height,
        width: canvas.width,
      },
      nodes: nodes,
      edges: edges.map((x) => ({
        id: x.id,
        weight: x.weight,
        firstNode: nodes.find((n) => n.id == x.firstNode.id),
        secondNode: nodes.find((n) => n.id == x.secondNode.id),
      })),
    };

    console.log(graph);
  };

  const getRandomGraph = () => {
    const translateNodes = (nodes, initialCanvas) => {
      const canvas = document
        .getElementsByTagName("svg")[0]
        .getBoundingClientRect();

      return nodes.map((node) => ({
        id: node.id,
        x: (node.x / initialCanvas.width) * canvas.width,
        y: (node.y / initialCanvas.height) * canvas.height,
      }));
    };

    const translateGraph = (graph) => {
      const nodes = translateNodes(graph.nodes, graph.canvas);

      const edges = graph.edges.map((edge) => ({
        id: edge.id,
        weight: edge.weight,
        firstNode: nodes.find((node) => node.id == edge.firstNode.id),
        secondNode: nodes.find((node) => node.id == edge.secondNode.id),
      }));

      return {
        nodes: nodes,
        edges: edges,
      };
    };

    let newGraphIndex = graphIndex;
    while (newGraphIndex == graphIndex && graphs.length > 1) {
      newGraphIndex = Math.floor(Math.random() * graphs.length);
    }

    setGraphIndex(newGraphIndex);

    const graph = translateGraph(graphs[newGraphIndex]);

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
        <button id={styles.clearCanvas} onClick={getRandomGraph}>
          Random graph
        </button>
        <button id={styles.clearCanvas} onClick={recordGraph}>
          Record graph
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
