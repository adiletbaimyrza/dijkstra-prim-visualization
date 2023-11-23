import { useState, useRef, useContext } from "react";
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
  const [draggedNode, setDraggedNode] = useState(null);

  const canvasRef = useRef(null);

  const canvasClickHandler = (event) => {
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
  };

  const nodeMouseDownHandler = (event, node) => {
    setDraggedNode(node);
  };

  const nodeMouseUpHandler = (event) => {
    setDraggedNode(null);
  };

  const nodeMouseMoveHandler = (event) => {
    event.stopPropagation();
    if (draggedNode) {
      const nodeAbsoluteX = event.clientX;
      const nodeAbsoluteY = event.clientY;
      const nodeCanvasRelativeX =
        nodeAbsoluteX - canvasRef.current.getBoundingClientRect().left;
      const nodeCanvasRelativeY =
        nodeAbsoluteY - canvasRef.current.getBoundingClientRect().top;

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === draggedNode.id
            ? { id: node.id, x: nodeCanvasRelativeX, y: nodeCanvasRelativeY }
            : node,
        ),
      );
    }
  };

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
            onMouseDown={nodeMouseDownHandler}
            onMouseUp={nodeMouseUpHandler}
            onMouseMove={nodeMouseMoveHandler}
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
