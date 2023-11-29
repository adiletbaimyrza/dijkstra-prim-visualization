import PropTypes from "prop-types";
import { createContext, useState } from "react";

const GraphParamsContext = createContext();

const useGraphParams = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [weightRange, setWeightRange] = useState([1, 10]);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    speed,
    setSpeed,
    weightRange,
    setWeightRange,
  };
};

const GraphParamsProvider = ({ children }) => {
  const graphParams = useGraphParams();

  return (
    <GraphParamsContext.Provider value={graphParams}>
      {children}
    </GraphParamsContext.Provider>
  );
};

export { GraphParamsContext, GraphParamsProvider };

GraphParamsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
