import PropTypes from "prop-types";
import styles from "./Node.module.css";

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
    <g
      className={styles.node}
      onClick={(event) => onNodeClick(event, { id: id, x: cx, y: cy })}
    >
      <circle className={styles.circle} id={id} cx={cx} cy={cy} r="20" />
      <text
        className={styles.text}
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {id}
      </text>
    </g>
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
