import { useState, useRef, useContext } from "react";
import classes from "./Canvas.module.css";
import { newEdgeValid, newNodePositionValid } from "./CanvasUtils";
import { GraphParamsContext } from "../../GraphParamsContext";
import Nodes from "./Nodes/Nodes";
import Edges from "./Edges/Edges";

const MAX_EDGE_WEIGHT = 100;

/**
 * Canvas component for visualizing nodes and edges.
 * Handles user interactions for adding nodes and edges
 * @returns {JSX.Element} The Canvas component.
 */
const Canvas = () => {
  // Destructure the states from context
  const { nodes, setNodes, edges, setEdges } = useContext(GraphParamsContext);

  // Object with default data to reset firstClickedNode, when needed
  const resetFirstClickedNode = {
    isClicked: false,
    node: null,
  };

  // Initialize state to track the first clicked node
  const [firstClickedNode, setFirstClickedNode] = useState(
    resetFirstClickedNode,
  );

  // Reference to the canvas SVG element
  const canvasRef = useRef(null);

  /**
   * Handler function for when the canvas is clicked.
   * Adds a new node at the clicked position if the position is valid.
   * @param {MouseEvent} event - The click event.
   */
  const canvasClickHandler = (event) => {
    setFirstClickedNode(resetFirstClickedNode);

    // Calculate the coordinates of the clicked point relative to the canvas
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

    // Check if the new node position is valid (not overlapping with existing nodes)
    if (!newNodePositionValid(newNode, nodes, canvasRef)) {
      return;
    }

    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  /**
   * Handler function for when a node is clicked.
   * Adds a new edge between the first and second nodes if a second node is clicked.
   * Resets the first node if the same node is clicked again.
   * @param {MouseEvent} event - The click event.
   * @param {Object} node - The clicked node object.
   */
  const nodeClickHandler = (event, node) => {
    event.stopPropagation();

    const addEdge = (firstNode, secondNode) => {
      const newEdge = {
        id: `${firstNode.id}-${secondNode.id}`,
        weight: Math.floor(Math.random() * MAX_EDGE_WEIGHT) + 1,
        firstNode: firstNode,
        secondNode: secondNode,
      };

      if (!newEdgeValid(newEdge, edges)) {
        return;
      }

      setEdges((prevEdges) => [...prevEdges, newEdge]);
    };

    if (!firstClickedNode.isClicked) {
      // If no node has been clicked yet, set the current node as the first clicked node
      setFirstClickedNode({ isClicked: true, node: node });
    } else if (
      firstClickedNode.node.x === node.x &&
      firstClickedNode.node.y === node.y
    ) {
      // If the same node is clicked again, reset the first clicked node
      console.log("same node clicked again, reset the first clicked node");
      setFirstClickedNode(resetFirstClickedNode);
    } else {
      // If a different node is clicked, add an edge and reset the first clicked node
      addEdge(firstClickedNode.node, node);
      setFirstClickedNode(resetFirstClickedNode);
    }
  };

  return (
    <div className={classes.canvasWrapper}>
      <svg
        ref={canvasRef}
        className={classes.canvas}
        onClick={canvasClickHandler}
      >
        <Edges edges={edges} />
        <Nodes nodes={nodes} onNodeClick={nodeClickHandler} />
      </svg>
    </div>
  );
};

export default Canvas;
