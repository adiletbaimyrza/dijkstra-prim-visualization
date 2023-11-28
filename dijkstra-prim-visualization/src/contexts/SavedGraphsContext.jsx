import PropTypes from "prop-types";
import { createContext, useState } from "react";

const SavedGraphsContext = createContext();

const useSavedGraphs = () => {
  const [savedGraph, setSavedGraph] = useState({ isSaved: false, graph: null });
  const [retrievedGraphs, setRetrievedGraphs] = useState([]);

  return { savedGraph, setSavedGraph, retrievedGraphs, setRetrievedGraphs };
};

const SavedGraphsProvider = ({ children }) => {
  const savedGraphs = useSavedGraphs();

  return (
    <SavedGraphsContext.Provider value={savedGraphs}>
      {children}
    </SavedGraphsContext.Provider>
  );
};

export { SavedGraphsContext, SavedGraphsProvider };

SavedGraphsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
