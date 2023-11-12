import PropTypes from "prop-types";
import Node from "./Node/Node";

/**
 * Renders a list of nodes on the canvas.
 * @param {Object[]} nodes - An array of node objects.
 * @param {string} nodes[].id - The unique identifier of the node.
 * @param {number} nodes[].x - The x-coordinate of the node.
 * @param {number} nodes[].y - The y-coordinate of the node.
 * @param {function} onNodeClick - A callback function to handle node click events.
 * @returns {JSX.Element} - A list of Node components.
 */
const Nodes = ({ nodes, onNodeClick }) => (
  <>
    {nodes.map((node) => (
      <Node
        key={node.id}
        id={node.id}
        cx={node.x}
        cy={node.y}
        onNodeClick={onNodeClick}
      />
    ))}
  </>
);

export default Nodes;

Nodes.propTypes = {
  nodes: PropTypes.array.isRequired,
  onNodeClick: PropTypes.func.isRequired,
};
