import { useContext, useEffect, useState } from "react";
import { GraphParamsContext } from "../../contexts/GraphParamsContext";
import { ModalContext } from "../../contexts/ModalsContext";
import { SavedGraphsContext } from "../../contexts/SavedGraphsContext";
import { startAnimations, startInstantAnimations } from "./animations";
import {
  runDijkstra,
  runPrim,
  areAllNodesConnected,
  translateGraph,
} from "./NavbarUtils";
import getRandomGraph from "./randomGraphGenerationLogic";
import styles from "./Navbar.module.css";
import PaperModal from "../Modals/PaperModal/PaperModal";
import DetailsModal from "../Modals/DetailsModal/DetailsModal";
import { createPortal } from "react-dom";
import { v4 as uuid4 } from "uuid";
import Slider from "@mui/material/Slider";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Switch from "@mui/material/Switch";

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

  const {
    setShowErrorModal,
    showPaperModal,
    setShowPaperModal,
    showDetailsModal,
    setShowDetailsModal,
  } = useContext(ModalContext);

  const { savedGraph, setSavedGraph, retrievedGraphs, setRetrievedGraphs } =
    useContext(SavedGraphsContext);

  const [canvasRect, setCanvasRect] = useState(null);
  const [activeButton, setActiveButton] = useState(1);
  const [nodesRange, setNodesRange] = useState([10, 15]);
  const [instantAnimation, setInstantAnimation] = useState(false);
  const [animating, setAnimating] = useState(false);

  const animatePrim = () => {
    if (areAllNodesConnected(nodes, edges)) {
      const animationsData = runPrim(nodes, edges);
      if (instantAnimation) {
        setAnimating(true);
        startInstantAnimations(animationsData, speed, setAnimating);
      } else {
        setAnimating(true);
        startAnimations(animationsData, speed, setAnimating);
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
        setAnimating(true);
        startInstantAnimations(animationsData, speed, setAnimating);
      } else {
        setAnimating(true);
        startAnimations(animationsData, speed, setAnimating);
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

  const setSpeedHandler = (speed) => {
    setActiveButton(speed);
    setSpeed(speed);
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

  useEffect(() => {
    const canvasRect = document
      .getElementById("canvas")
      .getBoundingClientRect();
    setCanvasRect(canvasRect);
  }, []);

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
      id: `graph-${uuid4().substring(0, 4)}`,
      canvas: {
        height: canvas.height,
        width: canvas.width,
      },
      nodes: nodes,
      edges: edges.map((x) => ({
        id: x.id,
        weight: x.weight,
        firstNode: nodes.find((n) => n.id === x.firstNode.id),
        secondNode: nodes.find((n) => n.id === x.secondNode.id),
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

  window.onresize = () =>
    translateGraph(nodes, edges, setNodes, setEdges, canvasRect, setCanvasRect);

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
              max={30}
              defaultValue={nodesRange}
            />
          </div>
          <button
            className={
              animating
                ? `${styles.randomButton} ${styles.unclickable}`
                : styles.randomButton
            }
            onClick={() =>
              getRandomGraph(setEdges, setNodes, nodesRange, weightRange)
            }
          >
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
                <Switch
                  color="secondary"
                  checked={instantAnimation}
                  onChange={() => setInstantAnimation(!instantAnimation)}
                />
                <span>Skip Animations</span>
              </label>
            </div>
          </div>
          <div className={styles.runButtons}>
            <button
              className={
                animating
                  ? `${styles.runButton} ${styles.unclickable}`
                  : styles.runButton
              }
              onClick={animatePrim}
            >
              RUN Prim
              <PlayCircleIcon className={styles.icon} />
            </button>
            <button
              className={
                animating
                  ? `${styles.runButton} ${styles.unclickable}`
                  : styles.runButton
              }
              onClick={animateDijkstra}
            >
              RUN Dijkstra
              <PlayCircleIcon className={styles.icon} />
            </button>
          </div>
        </div>

        <button
          id={styles.clearCanvas}
          className={animating ? styles.unclickable : ""}
          onClick={resetEdgesAndNodes}
        >
          Clear Canvas
        </button>
        <button id={styles.learnMore} onClick={() => setShowPaperModal(true)}>
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
        <div className={styles.footer}>
          <a
            className={styles.footerLink}
            href="https://github.com/AdiletBaimyrza/dijkstra-prim-visualization"
            target="_blank"
          >
            Source code
          </a>
          <a
            className={styles.footerLink}
            href="#"
            onClick={() => setShowDetailsModal(true)}
          >
            Details
          </a>
        </div>
      </div>

      {showPaperModal &&
        createPortal(
          <PaperModal onClose={() => setShowPaperModal(false)} />,
          document.body,
        )}

      {showDetailsModal &&
        createPortal(
          <DetailsModal onClose={() => setShowDetailsModal(false)} />,
          document.body,
        )}
    </>
  );
};

export default Navbar;
