import { useState, useRef, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import * as d3 from "d3";
import {
  newEdgeValid,
  newNodePositionValid,
  resetFirstClickedNode,
} from "./CanvasUtils";
import { GraphParamsContext, ModalContext } from "../../contexts";
import { ErrorModal } from "../Modals";
import Nodes from "./Nodes";
import Edges from "./Edges";
import styles from "./Canvas.module.css";

const Canvas = () => {
  const { nodes, setNodes, edges, setEdges, weightRange, zoom, setZoom } =
    useContext(GraphParamsContext);
  const { showErrorModal, setShowErrorModal } = useContext(ModalContext);

  const [firstClickedNode, setFirstClickedNode] = useState(
    resetFirstClickedNode(),
  );

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = d3.select(canvasRef.current);

    const zoomHandler = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        canvas.select(".zoomable").attr("transform", event.transform);
        const zoomLevel = event.transform.k;
        setZoom(zoomLevel);
      });

    canvas.call(zoomHandler);

    return () => {
      canvas.on(".zoom", null);
    };
  }, []);

  const canvasClickHandler = (event) => {
    if (firstClickedNode.isClicked) {
      document.getElementById(firstClickedNode.node.id).style.fill = "#d69edd";
      setFirstClickedNode(resetFirstClickedNode());
    }

    const nodeCanvasRelativeX =
      event.clientX - canvasRef.current.getBoundingClientRect().left;
    const nodeCanvasRelativeY =
      event.clientY - canvasRef.current.getBoundingClientRect().top;

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
      setFirstClickedNode(resetFirstClickedNode());
      document.getElementById(node.id).style.fill = "#d69edd";
    } else {
      addEdge(firstClickedNode.node, node);
      setFirstClickedNode(resetFirstClickedNode());
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
