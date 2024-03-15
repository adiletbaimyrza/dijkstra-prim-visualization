import PropTypes from "prop-types";
import Edge from "./Edge";
import { useContext } from "react";
import { GraphParamsContext } from "../../../contexts";

const Edges = () => {
  const { edges } = useContext(GraphParamsContext);
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
