import PropTypes from "prop-types";
import Edge from "./Edge";

const Edges = ({ edges }) => {
  return (
    <>
      {edges.map((edge) => (
        <Edge
          key={edge.id}
          id={edge.id}
          x1={edge.firstNode.x}
          y1={edge.firstNode.y}
          x2={edge.secondNode.x}
          y2={edge.secondNode.y}
          weight={edge.weight}
        />
      ))}
    </>
  );
};

export default Edges;

Edges.propTypes = {
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
      firstNode: PropTypes.object.isRequired,
      secondNode: PropTypes.object.isRequired,
    }),
  ).isRequired,
};
