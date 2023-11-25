import PropTypes from "prop-types";
import Node from "./Node/Node";

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
