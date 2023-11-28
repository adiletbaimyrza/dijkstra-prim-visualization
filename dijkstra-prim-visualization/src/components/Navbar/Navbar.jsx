import { useContext, useEffect, useState } from "react";
import { GraphParamsContext } from "../../contexts/GraphParamsContext";
import { ErrorModalContext } from "../../contexts/ModalsContext";
import { SavedGraphsContext } from "../../contexts/SavedGraphsContext";
import { startAnimations } from "./animations";
import { runDijkstra, runPrim, areAllNodesConnected } from "./NavbarUtils";
import styles from "./Navbar.module.css";
import PaperModal from "../Modals/PaperModal/PaperModal";
import { createPortal } from "react-dom";
import graphs from "../../assets/graphs/graphs";
import { v4 as uuid4 } from "uuid";

const Navbar = () => {
  const { nodes, edges, setNodes, setEdges, speed, setSpeed } =
    useContext(GraphParamsContext);

  const { setShowErrorModal, showPaperModal, setShowPaperModal } =
    useContext(ErrorModalContext);

  const { savedGraph, setSavedGraph, retrievedGraphs, setRetrievedGraphs } =
    useContext(SavedGraphsContext);

  const [activeButton, setActiveButton] = useState(1);

  const [graphIndex, setGraphIndex] = useState(0);

  const animatePrim = () => {
    if (areAllNodesConnected(nodes, edges)) {
      const animationsData = runPrim(nodes, edges);
      startAnimations(animationsData, speed);
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
      startAnimations(animationsData, speed);
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

  const getStockGraph = () => {
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

  const setSpeedHandler = (speed) => {
    setActiveButton(speed);
    setSpeed(speed);
  };

  const getRandomGraph = () => {
    const canvas = document
      .getElementsByTagName("svg")[0]
      .getBoundingClientRect();

    //pick number of nodes
    const minNodes = 5;
    const maxNodes = 12;
    const numberOfNodes = Math.floor(
      Math.random() * (maxNodes - minNodes - 1) + minNodes,
    );

    const nodes = [];
    const edges = [];

    //generate nodes
    const fullCircle = 6.2;
    let angle = Math.random() * fullCircle;
    const maxDiff = fullCircle / numberOfNodes;
    const minDiff = 0.4;
    for (let i = 0; i < numberOfNodes; ++i) {
      angle += Math.random() * (maxDiff - minDiff) + minDiff;
      let x = canvas.width / 2 + Math.cos(angle) * canvas.width * 0.3;
      let y = canvas.height / 2 + Math.sin(angle) * canvas.height * 0.3;

      nodes.push({
        id: i,
        x: x,
        y: y,
      });
    }

    //generate edges
    const base = Math.floor(Math.random() * nodes.length);
    for (let i = 0; i < nodes.length; ++i) {
      let probability = 1.0;
      for (let j = 0; j < nodes.length; ++j) {
        if (Math.random() <= probability && i != j) {
          const weight = Math.floor(Math.random() * (100 - 2) + 1);
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

            //check if the edge intersects
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

          //add an edge
          if (goodEdge) {
            probability -= 0.5;
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

  useEffect(() => {
    const retrievedGraphsString = localStorage.getItem("graphs");

    if (retrievedGraphsString) {
      const retrievedGraphs = JSON.parse(retrievedGraphsString);
      setRetrievedGraphs(retrievedGraphs);
    } else {
      setRetrievedGraphs([savedGraph.graph]);
    }
  }, [savedGraph]);

  const saveGraphToLocalStorage = (newGraph) => {
    const retrievedGraphsString = localStorage.getItem("graphs");

    if (retrievedGraphsString) {
      const retrievedGraphs = JSON.parse(retrievedGraphsString);
      retrievedGraphs.push(newGraph);

      localStorage.setItem("graphs", JSON.stringify(retrievedGraphs));
    } else {
      localStorage.setItem("graphs", JSON.stringify([newGraph]));
    }
  };

  const saveGraph = () => {
    const canvas = document
      .getElementsByTagName("svg")[0]
      .getBoundingClientRect();

    const newGraph = {
      id: uuid4().substring(0, 4),
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

    saveGraphToLocalStorage(newGraph);
    setSavedGraph({ isSaved: true, graph: newGraph });
  };

  const chooseGraphToDisplay = (graph) => {
    setNodes(graph.nodes);
    setEdges(graph.edges);
  };

  const deleteSavedGraph = (savedGraphId) => {
    const filteredGraphs = retrievedGraphs.filter(
      (graph) => graph.id !== savedGraphId,
    );
    setRetrievedGraphs(filteredGraphs);
    setSavedGraph({ isSaved: null, graph: null });
    localStorage.setItem("graphs", JSON.stringify(filteredGraphs));
  };

  return (
    <>
      <div className={styles.Navbar}>
        <button onClick={animatePrim}>Run prim's algorithm</button>
        <button onClick={animateDijkstra}>Run dijkstra's algorithm</button>
        <button id={styles.clearCanvas} onClick={resetEdgesAndNodes}>
          Clear canvas
        </button>

        <button onClick={recordGraph}>Record graph</button>
        <button onClick={getRandomGraph}>Random graph</button>
        <button onClick={() => setShowPaperModal(true)}>Paper</button>
        <button onClick={getStockGraph}>Stock graph</button>
        <button onClick={saveGraph}>Save graph</button>
        <div className={styles.setSpeed}>
          <div className={styles.setSpeedText}>Set speed</div>
          <div className={styles.setSpeedButtons}>
            {[0.5, 1, 2].map((speed) => (
              <button
                key={speed}
                className={activeButton === speed ? styles.active : ""}
                onClick={() => setSpeedHandler(speed)}
              >
                x {speed}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.savedGraphsWrapper}>
          <p className={styles.title}>Your Graphs</p>
          <div className={styles.savedGraphs}>
            {retrievedGraphs &&
              retrievedGraphs.map((graph) => (
                <div className={styles.graphRecord}>
                  <div
                    onClick={() => chooseGraphToDisplay(graph)}
                    id={graph.id}
                    className={styles.savedGraph}
                  >
                    {graph.id}
                  </div>
                  <div
                    className={styles.delete}
                    onClick={() => deleteSavedGraph(graph.id)}
                  >
                    delete
                  </div>
                </div>
              ))}
          </div>
        </div>
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
