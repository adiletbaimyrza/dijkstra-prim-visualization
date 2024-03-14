import { useState, useRef, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { newEdgeValid, newNodePositionValid } from "./CanvasUtils";
import { GraphParamsContext, ModalContext } from "../../contexts";
import { ErrorModal } from "../Modals";
import Nodes from "./Nodes";
import Edges from "./Edges";
import * as d3 from "d3";

import styles from "./Canvas.module.css";

const Canvas = () => {
  const { nodes, setNodes, edges, setEdges, weightRange } =
    useContext(GraphParamsContext);
  const { showErrorModal, setShowErrorModal } = useContext(ModalContext);

  const resetFirstClickedNode = {
    isClicked: false,
    node: null,
  };

  const [firstClickedNode, setFirstClickedNode] = useState(
    resetFirstClickedNode,
  );

  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(canvasRef.current);

    const zoomHandler = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        svg.select(".zoomable").attr("transform", event.transform);
        const zoomLevel = event.transform.k;
        setZoom(zoomLevel);
      });

    svg.call(zoomHandler);

    return () => {
      svg.on(".zoom", null);
    };
  }, []);

  const canvasClickHandler = (event) => {
    if (firstClickedNode.isClicked) {
      document.getElementById(firstClickedNode.node.id).style.fill = "#d69edd";
      setFirstClickedNode(resetFirstClickedNode);
    }

    const nodeAbsoluteX = event.clientX;
    const nodeAbsoluteY = event.clientY;

    const nodeCanvasRelativeX =
      nodeAbsoluteX - canvasRef.current.getBoundingClientRect().left;
    const nodeCanvasRelativeY =
      nodeAbsoluteY - canvasRef.current.getBoundingClientRect().top;

    console.log(nodeCanvasRelativeX, nodeCanvasRelativeY);

    console.log(
      "window.innerWidth, window.innerHeight: ",
      window.innerWidth,
      window.innerHeight,
    );
    console.log("event.clientX, event.clientY: ", event.clientX, event.clientY);
    console.log(
      "xRelative, yRelative: ",
      nodeCanvasRelativeX,
      nodeCanvasRelativeY,
    );

    const newNode = {
      id: nodes.length,
      x: nodeCanvasRelativeX,
      y: nodeCanvasRelativeY,
    };

    if (!newNodePositionValid(newNode, nodes, setShowErrorModal)) {
      return;
    }

    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const nodeClickHandler = (event, node) => {
    event.stopPropagation();

    const addEdge = (firstNode, secondNode) => {
      const newEdge = {
        id: `${firstNode.id}-${secondNode.id}`,
        weight: Math.floor(Math.random() * weightRange[1]) + 1,
        firstNode: firstNode,
        secondNode: secondNode,
      };

      if (!newEdgeValid(newEdge, edges, setShowErrorModal)) {
        return;
      }

      setEdges((prevEdges) => [...prevEdges, newEdge]);
    };

    if (!firstClickedNode.isClicked) {
      setFirstClickedNode({ isClicked: true, node: node });
      document.getElementById(node.id).style.fill = "#3f2873";
    } else if (
      firstClickedNode.node.x === node.x &&
      firstClickedNode.node.y === node.y
    ) {
      setShowErrorModal({
        show: true,
        text: "Same node clicked again. Click other nodes to make an edge.",
      });
      setFirstClickedNode(resetFirstClickedNode);
      document.getElementById(node.id).style.fill = "#d69edd";
    } else {
      addEdge(firstClickedNode.node, node);
      setFirstClickedNode(resetFirstClickedNode);
      document.getElementById(firstClickedNode.node.id).style.fill = "#d69edd";
    }
  };

  return (
    <>
      <div className={styles.canvasWrapper}>
        <svg
          ref={canvasRef}
          id="canvas"
          className={styles.canvas}
          onClick={canvasClickHandler}
        >
          <g className="zoomable">
            <Edges edges={edges} />
            <Nodes nodes={nodes} onNodeClick={nodeClickHandler} />
          </g>
        </svg>
      </div>

      {showErrorModal.show &&
        createPortal(
          <ErrorModal
            errorText={showErrorModal.text}
            onClose={() => setShowErrorModal({ show: false, text: null })}
          />,
          document.body,
        )}
    </>
  );
};

export default Canvas;
