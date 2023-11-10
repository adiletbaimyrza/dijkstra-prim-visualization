import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const GraphParamsContext = createContext();

// Custom hook useGraphParams to manage the states
const useGraphParams = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  return { nodes, setNodes, edges, setEdges };
};

/**
 * Provides the context for the graph parameters.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be rendered.
 * @returns {JSX.Element} - The context provider component with the graph parameters as value.
 */
export const GraphParamsProvider = ({ children }) => {
  // Get the graph parameters from the useGraphParams hook
  const graphParams = useGraphParams();

  // Return the context provider component with the graph parameters as value
  return (
    <GraphParamsContext.Provider value={graphParams}>
      {children}
    </GraphParamsContext.Provider>
  );
};

// Makes sure the 'children' prop is a React node and that it is a required parameter
GraphParamsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
