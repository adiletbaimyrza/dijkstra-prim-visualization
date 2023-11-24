import { useState, useRef, useContext } from "react";
import { createPortal } from "react-dom";
import styles from "./Canvas.module.css";
import { newEdgeValid, newNodePositionValid } from "./CanvasUtils";
import { GraphParamsContext } from "../../contexts/GraphParamsContext";
import ErrorModal from "../Modals/ErrorModal/ErrorModal";
import { ErrorModalContext } from "../../contexts/ModalsContext";

const MAX_EDGE_WEIGHT = 100;

const Canvas = () => {
  const { nodes, setNodes, edges, setEdges } = useContext(GraphParamsContext);
  const { showErrorModal, setShowErrorModal } = useContext(ErrorModalContext);

  const resetFirstClickedNode = {
    isClicked: false,
    node: null,
  };

  const [firstClickedNode, setFirstClickedNode] = useState(
    resetFirstClickedNode,
  );

  const canvasRef = useRef(null);

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

    if (!firstClickedNode.isClicked) {
      setFirstClickedNode({ isClicked: true, node: node });
      document.getElementById(node.id).style.fill = "#3f2873";
    } else if (
      firstClickedNode.node.x === node.x &&
      firstClickedNode.node.y === node.y
    ) {
      setShowErrorModal({
        show: true,
        text: "same node clicked again, reset the first clicked node",
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
          className={styles.canvas}
          onClick={canvasClickHandler}
        >
          {edges.map((edge) => (
            <g key={edge.id}>
              <line
                className={styles.line}
                id={edge.id}
                x1={edge.firstNode.x}
                y1={edge.firstNode.y}
                x2={edge.secondNode.x}
                y2={edge.secondNode.y}
              />
              <text
                className={styles.weight}
                x={(edge.firstNode.x + edge.secondNode.x) / 2}
                y={(edge.firstNode.y + edge.secondNode.y) / 2}
              >
                {edge.weight}
              </text>
            </g>
          ))}
          {nodes.map((node) => (
            <g
              key={node.id}
              className={styles.node}
              onClick={(event) => nodeClickHandler(event, node)}
            >
              <circle
                className={styles.circle}
                id={node.id}
                cx={node.x}
                cy={node.y}
                r="20"
              />
              <text
                className={styles.nodeId}
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {node.id}
              </text>
            </g>
          ))}
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
