import PropTypes from "prop-types";
import classes from "./Node.module.css";

/**
 * Renders a node on the canvas.
 * @param {Object} props - The props object.
 * @param {string} props.id - The id of the node.
 * @param {number} props.cx - The x-coordinate of the node.
 * @param {number} props.cy - The y-coordinate of the node.
 * @param {function} props.onNodeClick - The function to call when the node is clicked.
 * @returns {JSX.Element} - The node element.
 */
const Node = ({ id, cx, cy, onNodeClick }) => {
  return (
    <circle
      className={classes.circle}
      id={id}
      cx={cx}
      cy={cy}
      r="14" // TODO: Make the radius a prop to allow for customization
      onClick={(event) => onNodeClick(event, { id: id, x: cx, y: cy })}
    />
  );
};

export default Node;

// Ensures that the required props are passed and have the correct type
Node.propTypes = {
  onNodeClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
};
