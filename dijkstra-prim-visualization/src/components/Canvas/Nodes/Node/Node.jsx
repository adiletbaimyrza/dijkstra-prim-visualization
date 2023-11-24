import PropTypes from "prop-types";
import styles from "./Node.module.css";

const Node = ({ id, cx, cy, onNodeClick /* onNodeMouseDown */ }) => {
  return (
    <g
      className={styles.node}
      /* onClick={(event) => onNodeClick(event, { id: id, x: cx, y: cy })} */
      onClick={(event) => onNodeClick(event)}
      /* onMouseDown={() => onNodeMouseDown({ id: id, x: cx, y: cy })} */
    >
      <circle className={styles.circle} id={id} cx={cx} cy={cy} r="20" />
      <text
        id={`${id}-text`}
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
  /* onNodeMouseDown: PropTypes.func.isRequired, */
  id: PropTypes.number.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
};
