import PropTypes from "prop-types";
import classes from "./Edge.module.css";

/**
 * Renders an edge between two points on the canvas.
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier for the edge.
 * @param {number} props.x1 - The x-coordinate of the starting point.
 * @param {number} props.y1 - The y-coordinate of the starting point.
 * @param {number} props.x2 - The x-coordinate of the ending point.
 * @param {number} props.y2 - The y-coordinate of the ending point.
 * @returns {JSX.Element} - The rendered component.
 */
const Edge = ({ id, x1, y1, x2, y2, weight }) => {
  return (
    <g>
      <line className={classes.line} id={id} x1={x1} y1={y1} x2={x2} y2={y2} />
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2} fill="white">
        {weight}
      </text>
    </g>
  );
};

export default Edge;

// Validates that the required props are passed and their type is number
Edge.propTypes = {
  id: PropTypes.string.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
};
