import PropTypes from "prop-types";
import React from "react";
import Edge from "./Edge/Edge";

/**
 * Renders edges on the canvas.
 * @param {Object[]} edges - An array of edge objects.
 * @param {string} edges[].id - The unique identifier of the edge.
 * @param {Object} edges[].firstNode - The first node of the edge.
 * @param {number} edges[].firstNode.x - The x-coordinate of the first node.
 * @param {number} edges[].firstNode.y - The y-coordinate of the first node.
 * @param {Object} edges[].secondNode - The second node of the edge.
 * @param {number} edges[].secondNode.x - The x-coordinate of the second node.
 * @param {number} edges[].secondNode.y - The y-coordinate of the second node.
 * @param {number} edges[].weight - The weight of the edge.
 * @returns {JSX.Element} - The rendered edges and their weights.
 */
const Edges = ({ edges }) => {
  return (
    <>
      {edges.map((edge) => (
        <React.Fragment key={edge.id}>
          <Edge
            id={edge.id}
            x1={edge.firstNode.x}
            y1={edge.firstNode.y}
            x2={edge.secondNode.x}
            y2={edge.secondNode.y}
          />
          <text
            x={(edge.firstNode.x + edge.secondNode.x) / 2}
            y={(edge.firstNode.y + edge.secondNode.y) / 2}
            fill="white"
          >
            {edge.weight}
          </text>
        </React.Fragment>
      ))}
    </>
  );
};

export default Edges;

Edges.propTypes = {
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
      firstNode: PropTypes.object.isRequired,
      secondNode: PropTypes.object.isRequired,
    }),
  ).isRequired,
};
