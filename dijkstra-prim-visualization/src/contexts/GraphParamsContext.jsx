import PropTypes from "prop-types";
import { createContext, useState } from "react";

const GraphParamsContext = createContext();

const useGraphParams = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [speed, setSpeed] = useState(2);
  const [weightRange, setWeightRange] = useState([1, 10]);
  const [zoom, setZoom] = useState(1);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    speed,
    setSpeed,
    weightRange,
    setWeightRange,
    zoom,
    setZoom,
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
