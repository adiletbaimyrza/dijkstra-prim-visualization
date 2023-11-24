import PropTypes from "prop-types";
import { createContext, useState } from "react";

const DragModeContext = createContext();

const useDragMode = () => {
  const [dragMode, setDragMode] = useState(false);

  return { dragMode, setDragMode };
};

const DragModeProvider = ({ children }) => {
  const dragModeValues = useDragMode();

  return (
    <DragModeContext.Provider value={dragModeValues}>
      {children}
    </DragModeContext.Provider>
  );
};

export { DragModeContext, DragModeProvider };

DragModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
