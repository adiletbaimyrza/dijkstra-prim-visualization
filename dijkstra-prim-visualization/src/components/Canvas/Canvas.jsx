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
  const { nodes, setNodes, setZoom, firstClickedNode, setFirstClickedNode } =
    useContext(GraphParamsContext);
  const { showErrorModal, setShowErrorModal } = useContext(ModalContext);

  /* console.log("canvas render", nodes); */

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = d3.select(canvasRef.current);

    const zoomHandler = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", ({ transform }) => {
        canvas.select(".zoomable").attr("transform", transform);
        const zoomLevel = transform.k;
        setZoom(zoomLevel);
      });

    canvas.call(zoomHandler);

    canvas.on("dblclick.zoom", null);
  }, []);

  const canvasClickHandler = (event) => {
    console.log("canvas clicked");
    if (firstClickedNode.isClicked) {
      document.getElementById(firstClickedNode.node.id).style.fill = "#d69edd";
      setFirstClickedNode(resetFirstClickedNode());
    }

    /*  const nodeCanvasRelativeX =
      event.clientX - canvasRef.current.getBoundingClientRect().left;
    const nodeCanvasRelativeY =
      event.clientY - canvasRef.current.getBoundingClientRect().top; */
    const [x, y] = d3.pointer(event);

    // Invert the zoom transform
    const canvas = d3.select(canvasRef.current);
    const invertTransform = d3.zoomTransform(canvas.node()).invert([x, y]);
    const nodeCanvasRelativeX = invertTransform[0];

    const nodeCanvasRelativeY = invertTransform[1];

    const newNode = {
      id: nodes.length,
      x: nodeCanvasRelativeX,
      y: nodeCanvasRelativeY,
    };

    console.log("on canvas click:", nodeCanvasRelativeX, nodeCanvasRelativeY);

    if (!newNodePositionValid(newNode, nodes, setShowErrorModal)) {
      return;
    }

    setNodes((prevNodes) => [...prevNodes, newNode]);
    console.log("setNodes called in CanvasClickhandler");
  };

  return (
    <>
      <div className={styles.canvasWrapper}>
        <svg
          ref={canvasRef}
          id="canvas"
          className={styles.canvas}
          onClick={canvasClickHandler}
          /* viewBox={`0 0 ${1568 * 10} ${892.812 * 10}`} */
        >
          <g className="zoomable">
            <Edges />
            <Nodes canvasRef={canvasRef} />
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
