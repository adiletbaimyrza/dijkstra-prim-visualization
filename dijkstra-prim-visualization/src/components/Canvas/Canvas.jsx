import { useState, useRef, useContext } from "react";
import classes from "./Canvas.module.css";
import Node from "./Node/Node";
import Edge from "./Edge/Edge";
import { newEdgeValid, newNodePositionValid } from "./CanvasUtils";
import { GraphParamsContext } from "../../GraphParamsContext";

/**
 * Canvas component for visualizing nodes and edges.
 * @returns {JSX.Element} The Canvas component.
 */
const Canvas = () => {
  // Destructure the states from context
  const { nodePoints, setNodePoints, edges, setEdges } =
    useContext(GraphParamsContext);

  // Object with default data to reset firstNode, when needed
  const resetNodeData = {
    isClicked: false,
    x: null,
    y: null,
  };

  // State variable to keep track of the first node clicked when creating an edge
  const [firstNode, setFirstNode] = useState(resetNodeData);

  // Reference to the canvas SVG element
  const canvasRef = useRef(null);

  // Handler function for when the canvas is clicked
  const canvasClickHandler = (event) => {
    // Reset the firstNode state variable
    setFirstNode(resetNodeData);

    // Calculate the coordinates of the clicked point relative to the canvas
    const nodePointAbsoluteX = event.clientX;
    const nodePointAbsoluteY = event.clientY;
    const nodePointCanvasRelativeX =
      nodePointAbsoluteX - canvasRef.current.getBoundingClientRect().left;
    const nodePointCanvasRelativeY =
      nodePointAbsoluteY - canvasRef.current.getBoundingClientRect().top;

    // Create a new node point object
    const newNodePoint = {
      x: nodePointCanvasRelativeX,
      y: nodePointCanvasRelativeY,
    };

    // Check if the new node position is valid (not overlapping with existing nodes)
    if (!newNodePositionValid(newNodePoint, nodePoints, canvasRef)) {
      return;
    }

    // Add the new node point to the list of all nodes
    setNodePoints((prevNodePoints) => [...prevNodePoints, newNodePoint]);
  };

  // Handler function for when a node is clicked
  const nodeClickHandler = (event, points) => {
    event.stopPropagation();

    // If no first node has been clicked yet, set the clicked node as the first node
    if (firstNode.isClicked === false) {
      setFirstNode({ isClicked: true, x: points.x, y: points.y });
    }
    // If the same node is clicked again, reset the first node
    else if (firstNode.x === points.x && firstNode.y === points.y) {
      console.log("first node clicked again, reset firstNode");
      setFirstNode(resetNodeData);
    }
    // If a different node is clicked, create a new edge between the first and second nodes
    else {
      addEdge(firstNode, { x: points.x, y: points.y });
      setFirstNode(resetNodeData);
    }
  };

  // Function to add a new edge to the list of all edges
  const addEdge = (firstNode, secondNode) => {
    const newEdge = {
      x1: firstNode.x,
      y1: firstNode.y,
      x2: secondNode.x,
      y2: secondNode.y,
    };

    // Check if the new edge is valid (not overlapping with existing edges)
    if (!newEdgeValid(newEdge, edges)) {
      return;
    }

    // Add the new edge to the list of all edges
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  };

  // Render the canvas SVG element with all nodes and edges
  return (
    <svg
      ref={canvasRef}
      className={classes.canvas}
      onClick={canvasClickHandler}
    >
      {/* Render all edges */}
      {edges.map((edge, index) => (
        <Edge key={index} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} />
      ))}
      {/* Render all nodes */}
      {nodePoints.map((nodePoint, index) => (
        <Node
          key={index}
          cx={nodePoint.x}
          cy={nodePoint.y}
          onNodeClick={nodeClickHandler}
        />
      ))}
    </svg>
  );
};

export default Canvas;
