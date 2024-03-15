import PropTypes from "prop-types";
import Node from "./Node";
import { useContext } from "react";
import { GraphParamsContext } from "../../../contexts";

const Nodes = ({ canvasRef }) => {
  const { nodes } = useContext(GraphParamsContext);
  console.log("nodes render", nodes);

  return (
    <>
      {nodes.map((node) => (
        <Node
          key={node.id}
          id={node.id}
          cx={node.x}
          cy={node.y}
          canvasRef={canvasRef}
        />
      ))}
    </>
  );
};

export default Nodes;
