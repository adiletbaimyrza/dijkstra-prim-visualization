import PropTypes from "prop-types";
import Node from "./Node/Node";

const Nodes = ({ nodes, onNodeClick, onMouseDown, onMouseUp, onMouseMove }) => (
  <>
    {nodes.map((node) => (
      <Node
        key={node.id}
        id={node.id}
        cx={node.x}
        cy={node.y}
        onNodeClick={onNodeClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />
    ))}
  </>
);

export default Nodes;

Nodes.propTypes = {
  nodes: PropTypes.array.isRequired,
  onNodeClick: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired,
};
