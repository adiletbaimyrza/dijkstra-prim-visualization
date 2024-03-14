import PropTypes from "prop-types";
import styles from "./Edge.module.css";

const Edge = ({ id, x1, y1, x2, y2, weight }) => {
  return (
    <g>
      <line className={styles.line} id={id} x1={x1} y1={y1} x2={x2} y2={y2} />
      <text
        id={`${id}-weight`}
        className={styles.text}
        x={(x1 + x2) / 2}
        y={(y1 + y2) / 2}
        fill="white"
      >
        {weight}
      </text>
    </g>
  );
};

export default Edge;

Edge.propTypes = {
  id: PropTypes.string.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
};
