import PropTypes from "prop-types";
import classes from "./Node.module.css";

/**
 * A component that renders a circle representing a node on the canvas.
 * @param {number} cx - The x-coordinate of the center of the circle.
 * @param {number} cy - The y-coordinate of the center of the circle.
 * @param {function} onNodeClick - A callback function to handle click events on the node.
 */
const Node = ({ cx, cy, onNodeClick }) => {
  return (
    <circle
      className={classes.circle}
      cx={cx}
      cy={cy}
      r="14" // TODO: Make the radius a prop to allow for customization
      onClick={(event) => onNodeClick(event, { x: cx, y: cy })}
    />
  );
};

export default Node;

// Ensures that the required props are passed and have the correct type
Node.propTypes = {
  onNodeClick: PropTypes.func.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
};
