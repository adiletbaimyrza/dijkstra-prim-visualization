import PropTypes from "prop-types";
import classes from "./Edge.module.css";

/**
 * Renders a line connecting two points on the canvas.
 * @param {number} x1 - The x-coordinate of the starting point.
 * @param {number} y1 - The y-coordinate of the starting point.
 * @param {number} x2 - The x-coordinate of the ending point.
 * @param {number} y2 - The y-coordinate of the ending point.
 */
const Edge = ({ x1, y1, x2, y2 }) => {
  return <line className={classes.line} x1={x1} y1={y1} x2={x2} y2={y2} />;
};

export default Edge;

// Validates that the required props are passed and their type is number
Edge.propTypes = {
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
};
