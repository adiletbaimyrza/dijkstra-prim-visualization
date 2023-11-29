import { useContext, useEffect, useState } from "react";
import { GraphParamsContext } from "../../contexts/GraphParamsContext";
import { ErrorModalContext } from "../../contexts/ModalsContext";
import { SavedGraphsContext } from "../../contexts/SavedGraphsContext";
import { startAnimations, startInstantAnimations } from "./animations";
import { runDijkstra, runPrim, areAllNodesConnected } from "./NavbarUtils";
import styles from "./Navbar.module.css";
import PaperModal from "../Modals/PaperModal/PaperModal";
import { createPortal } from "react-dom";
import graphs from "../../assets/graphs/graphs";
import { v4 as uuid4 } from "uuid";
import Slider from "@mui/material/Slider";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

const Navbar = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    speed,
    setSpeed,
    weightRange,
    setWeightRange,
  } = useContext(GraphParamsContext);

  const { setShowErrorModal, showPaperModal, setShowPaperModal } =
    useContext(ErrorModalContext);

  const { savedGraph, setSavedGraph, retrievedGraphs, setRetrievedGraphs } =
    useContext(SavedGraphsContext);

  const [activeButton, setActiveButton] = useState(1);
  const [nodesRange, setNodesRange] = useState([5, 12]);

  const [graphIndex, setGraphIndex] = useState(0);

  const [instantAnimation, setInstantAnimation] = useState(false);

  const animatePrim = () => {
    if (areAllNodesConnected(nodes, edges)) {
      const animationsData = runPrim(nodes, edges);
      if (instantAnimation) {
        startInstantAnimations(animationsData, speed);
      } else {
        startAnimations(animationsData, speed);
      }
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
      if (instantAnimation) {
        startInstantAnimations(animationsData, speed);
      } else {
        startAnimations(animationsData, speed);
      }
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
    const canvas = document.getElementById("canvas").getBoundingClientRect();

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
      const canvas = document.getElementById("canvas").getBoundingClientRect();

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
    const canvas = document.getElementById("canvas").getBoundingClientRect();

    console.log(document.getElementsByClassName("canvas"));
    //pick number of nodes
    const minNodes = nodesRange[0];
    const maxNodes = nodesRange[1];
    const numberOfNodes =
      Math.floor(Math.random() * (maxNodes - minNodes + 1)) + minNodes;

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
      setRetrievedGraphs([]);
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
    const canvas = document.getElementById("canvas").getBoundingClientRect();

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
    console.log(graph);
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
        <div className={styles.randomGraphDiv}>
          <div className={styles.sliderWrapper}>
            <div className={styles.sliderTitle}>Weight Range</div>
            <Slider
              onChange={(event) => {
                setWeightRange(event.target.value);
              }}
              color="secondary"
              className={styles.slider}
              valueLabelDisplay="auto"
              min={1}
              max={100}
              defaultValue={weightRange}
            />
          </div>
          <div className={styles.sliderWrapper}>
            <div className={styles.sliderTitle}>Nodes Range</div>
            <Slider
              onChange={(event) => {
                setNodesRange(event.target.value);
              }}
              color="secondary"
              className={styles.slider}
              valueLabelDisplay="auto"
              min={3}
              max={20}
              defaultValue={nodesRange}
            />
          </div>
          <button id={styles.randomButton} onClick={getRandomGraph}>
            Random Graph <ShuffleIcon className={styles.icon} />
          </button>
        </div>
        <div className={styles.runDiv}>
          <div className={styles.setSpeed}>
            <div className={styles.setSpeedText}>Set Speed</div>
            <div className={styles.setSpeedButtons}>
              {[0.5, 1, 2].map((speed) => (
                <button
                  key={speed}
                  className={`${styles.speedButton} ${
                    activeButton === speed ? styles.active : ""
                  }`}
                  onClick={() => setSpeedHandler(speed)}
                >
                  x {speed}
                </button>
              ))}
            </div>
            <div id={styles.instantAnimation}>
              <label>
                <input
                  type="checkbox"
                  checked={instantAnimation}
                  onChange={() => setInstantAnimation(!instantAnimation)}
                />
                <span>Instant animation</span>
              </label>
            </div>
          </div>
          <div className={styles.runButtons}>
            <button className={styles.runButton} onClick={animatePrim}>
              RUN Prim
              <PlayCircleIcon className={styles.icon} />
            </button>
            <button className={styles.runButton} onClick={animateDijkstra}>
              RUN Dijkstra
              <PlayCircleIcon className={styles.icon} />
            </button>
          </div>
        </div>

        <button id={styles.clearCanvas} onClick={resetEdgesAndNodes}>
          Clear Canvas
        </button>
        <button onClick={() => setShowPaperModal(true)}>
          Learn More <InfoIcon className={styles.icon} />
        </button>

        <div className={styles.savedGraphsDiv}>
          <button id={styles.saveGraph} onClick={saveGraph}>
            Save Graph <SaveAltIcon className={styles.icon} />
          </button>

          <div className={styles.savedGraphsWrapper}>
            <p className={styles.title}>Your Graphs</p>
            <div className={styles.savedGraphs}>
              {retrievedGraphs &&
                retrievedGraphs.map((graph) => (
                  <div key={graph.id} className={styles.graphRecord}>
                    <button
                      onClick={() => chooseGraphToDisplay(graph)}
                      id={graph.id}
                      className={styles.savedGraph}
                    >
                      {graph.id}
                    </button>
                    <div
                      className={styles.delete}
                      onClick={() => deleteSavedGraph(graph.id)}
                    >
                      <DeleteIcon />
                    </div>
                  </div>
                ))}
            </div>
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
