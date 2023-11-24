import { useState, useRef, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import classes from "./Canvas.module.css";
import { newEdgeValid, newNodePositionValid } from "./CanvasUtils";
import { GraphParamsContext } from "../../contexts/GraphParamsContext";
import Nodes from "./Nodes/Nodes";
import Edges from "./Edges/Edges";
import ErrorModal from "../Modals/ErrorModal/ErrorModal";
import { ErrorModalContext } from "../../contexts/ModalsContext";

const MAX_EDGE_WEIGHT = 100;

const Canvas = () => {
  const { nodes, setNodes, edges, setEdges } = useContext(GraphParamsContext);
  const { showErrorModal, setShowErrorModal } = useContext(ErrorModalContext);

  const [firstClickedNode, setFirstClickedNode] = useState(null);
  /* const draggedNode = useRef(null); */

  const canvasRef = useRef(null);

  const canvasClickHandler = (event) => {
    /* if (draggedNode.current === null) { */
    if (firstClickedNode) {
      document.getElementById(firstClickedNode.node.id).style.fill = "#d69edd";
      setFirstClickedNode(null);
    }

    const nodeAbsoluteX = event.clientX;
    const nodeAbsoluteY = event.clientY;
    const nodeCanvasRelativeX =
      nodeAbsoluteX - canvasRef.current.getBoundingClientRect().left;
    const nodeCanvasRelativeY =
      nodeAbsoluteY - canvasRef.current.getBoundingClientRect().top;

    const newNode = {
      id: nodes.length,
      x: nodeCanvasRelativeX,
      y: nodeCanvasRelativeY,
    };

    if (!newNodePositionValid(newNode, nodes, canvasRef, setShowErrorModal)) {
      return;
    }

    setNodes((prevNodes) => [...prevNodes, newNode]);

    console.log("canvasClickHandler executed");
    /* } */
  };

  const nodeClickHandler = (event, node) => {
    event.stopPropagation();

    const addEdge = (firstNode, secondNode) => {
      const newEdge = {
        id: `${firstNode.id}-${secondNode.id}`,
        weight: Math.floor(Math.random() * MAX_EDGE_WEIGHT) + 1,
        firstNode: firstNode,
        secondNode: secondNode,
      };

      if (!newEdgeValid(newEdge, edges, setShowErrorModal)) {
        return;
      }

      setEdges((prevEdges) => [...prevEdges, newEdge]);
    };

    if (!firstClickedNode) {
      setFirstClickedNode(node);
      document.getElementById(node.id).style.fill = "#3f2873";
    } else if (
      firstClickedNode.node.x === node.x &&
      firstClickedNode.node.y === node.y
    ) {
      setShowErrorModal({
        show: true,
        text: "same node clicked again, reset the first clicked node",
      });
      setFirstClickedNode(null);
      document.getElementById(node.id).style.fill = "#d69edd";
    } else {
      addEdge(firstClickedNode.node, node);
      setFirstClickedNode(null);
      document.getElementById(firstClickedNode.node.id).style.fill = "#d69edd";
    }
    console.log("nodeClickHandler executed");
  };

  /* useEffect(() => {
    canvasRef.current.addEventListener("mousemove", nodeMouseMoveHandler);
    canvasRef.current.addEventListener("mouseup", nodeMouseUpHandler);
    console.log("useEffect executed");
  }, []); */

  /* const nodeMouseDownHandler = (node) => {
    if (draggedNode.current === null) {
      draggedNode.current = node;
      console.log("nodeMouseDownHandler executed");
      console.log(draggedNode.current);
    }
  };

  const nodeMouseUpHandler = () => {
    console.log("Before check:", draggedNode.current);

    if (draggedNode.current !== null) {
      const x = document
        .getElementById(`${draggedNode.current.id}`)
        .getAttribute("cx");
      const y = document
        .getElementById(`${draggedNode.current.id}`)
        .getAttribute("cy");

      console.log("After check:", draggedNode.current);

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === draggedNode.current.id
            ? { id: node.id, x: x, y: y }
            : node,
        ),
      );
      console.log("nodes are set");
    }

    console.log("nodeMouseUpHandler executed");
  };

  const nodeMouseMoveHandler = (event) => {
    if (draggedNode.current !== null) {
      requestAnimationFrame(() => {
        const nodeAbsoluteX = event.clientX;
        const nodeAbsoluteY = event.clientY;
        const nodeCanvasRelativeX =
          nodeAbsoluteX - canvasRef.current.getBoundingClientRect().left;
        const nodeCanvasRelativeY =
          nodeAbsoluteY - canvasRef.current.getBoundingClientRect().top;

        document
          .getElementById(`${draggedNode.current.id}`)
          .setAttribute("cx", nodeCanvasRelativeX);
        document
          .getElementById(`${draggedNode.current.id}`)
          .setAttribute("cy", nodeCanvasRelativeY);
        document
          .getElementById(`${draggedNode.current.id}-text`)
          .setAttribute("x", nodeCanvasRelativeX);
        document
          .getElementById(`${draggedNode.current.id}-text`)
          .setAttribute("y", nodeCanvasRelativeY);
      });
      console.log("nodeMouseMoveHandler executed");
    }
  }; */

  const nodeClickHandlerPlaceHolder = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <div className={classes.canvasWrapper}>
        <svg
          ref={canvasRef}
          className={classes.canvas}
          onClick={canvasClickHandler}
        >
          <Edges edges={edges} />
          <Nodes
            nodes={nodes}
            onNodeClick={nodeClickHandlerPlaceHolder}
            /* onNodeMouseDown={nodeMouseDownHandler} */
          />
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
